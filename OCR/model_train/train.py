import sys
import os
import numpy  as np
import tensorflow as tf
import matplotlib.pyplot as plt
import cv2

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


# GPU Configuration
print("Num GPUs Available:", len(tf.config.list_physical_devices('GPU')))

try:
    [tf.config.experimental.set_memory_growth(gpu, True)
     for gpu in tf.config.experimental.list_physical_devices("GPU")]
except:
    pass

from model_train.ctc_loss import CTCloss
from model_train.grayscalereader import GrayscaleImageReader
from model_train.model import train_model
from metrics.conf_matrix import ConfMatrixCallback
from metrics.char_prf1 import CharPRF1


from model_train.np_image_resizer import NumpyImageResizer
from mltu.transformers import LabelIndexer, LabelPadding
from mltu.tensorflow.dataProvider import DataProvider
from mltu.tensorflow.metrics import CWERMetric
from keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, TensorBoard
from mltu.tensorflow.callbacks import Model2onnx, TrainLogger

from configs.config import ModelConfiguration


# Clean labels 
def clean_labels(data_path):
    labels_dir = os.path.join(data_path, "labels")
    for filename in os.listdir(labels_dir):
        if filename.endswith(".txt"):
            path = os.path.join(labels_dir, filename)
            with open(path, "r+", encoding="utf-8") as f:
                text = f.read().strip()
                cleaned = text.replace(" ", "")
                f.seek(0)
                f.write(cleaned)
                f.truncate()
    print("All labels cleaned! Removed spaces.")

def standardize_label(label):
    num_map = {'0':'०', '1':'१', '2':'२', '3':'३', '4':'४',
               '5':'५', '6':'६', '7':'७', '8':'८', '9':'९'}
    return ''.join([num_map.get(c, c) for c in label])


# Read Dataset and Extract Labels
def read_dataset(image_list_path, data_path, clean_labels_first=True):
    if clean_labels_first:
        clean_labels(data_path)
        
    dataset, vocab, max_len = [], set(), 0

    with open(image_list_path, "r", encoding="utf-8") as f:
        image_paths = [line.strip() for line in f]

    for img_rel_path in image_paths:
        img_path = os.path.join(data_path, img_rel_path)
        label_filename = os.path.basename(img_path).replace(".jpg", ".txt")
        label_path = os.path.join(data_path, "labels", label_filename)

        with open(label_path, "r", encoding="utf-8") as lf:
            label = lf.read().strip()
        
        if not label:
            print(f"Empty label in {label_path}")
            continue

        dataset.append([img_path, label])
        vocab.update(label)
        max_len = max(max_len, len(label))

    return dataset, sorted(vocab), max_len

def labels_to_texts(labels_batch, vocab):
    texts = []
    for label_seq in labels_batch:
        text = ''.join([vocab[idx] if idx < len(vocab) else '' for idx in label_seq])
        texts.append(text)
    return texts

def main():
    config = ModelConfiguration()

    # Defining paths
    data_path = "../Datasets"
    train_annotation_path = os.path.join(data_path, "annotation.train.txt")
    val_annotation_path = os.path.join(data_path, "annotation.val.txt")

    # Read Dataset
    print("Loading training data...")
    train_dataset, train_vocab, max_train_len = read_dataset(train_annotation_path, data_path)
    print("Loading validation data...")
    val_dataset, val_vocab, max_val_len = read_dataset(val_annotation_path, data_path)
    

    characters = list("".join(train_vocab)) 
    char_to_num = {char: idx for idx, char in enumerate(characters)}

    def encode_label(label):
        return [char_to_num[c] for c in label]
    
    print(encode_label('ग१ख४५६२'))

    config.vocab = "".join(train_vocab) + "#"
    char_to_num = {c: i for i, c in enumerate(config.vocab)}
    config.max_text_length = max(max_train_len, max_val_len)
    config.save()

    # Create data provider for model training
    train_data_provider = DataProvider(
        dataset=train_dataset,
        skip_validation=True,
        shuffle=True,
        batch_size=config.batch_size,
        data_preprocessors=[GrayscaleImageReader()],
        transformers=[
            NumpyImageResizer(config.width, config.height),
            LabelIndexer(config.vocab),
            LabelPadding(max_word_length=config.max_text_length, padding_value=len(config.vocab) - 1)
        ]
    )

    # Create data provider for model validation
    val_data_provider = DataProvider(
        dataset=val_dataset,
        skip_validation=True,
        batch_size=config.batch_size,
        data_preprocessors=[GrayscaleImageReader()],
        transformers=[
            NumpyImageResizer(config.width, config.height),
            LabelIndexer(config.vocab),
            LabelPadding(max_word_length=config.max_text_length, padding_value=len(config.vocab) - 1)
        ]
    )

    # Model Initialization
    model = train_model(
        input_dimen=(config.height, config.width, 1),
        output_dimen=len(config.vocab)
    )

    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=config.learning_rate),
        loss=CTCloss(blank_index=len(config.vocab)),
        metrics=[
            CWERMetric(padding_token=-1),
            CharPRF1(pad=-1)
        ],  
        run_eagerly=False
    )

    model.summary(line_length=110)

    print("Max label length:", config.max_text_length)

    dummy_input = tf.random.uniform((1, config.height, config.width, 1))
    dummy_output = model(dummy_input)
    print("Model output shape:", dummy_output.shape) 
    print("Output sequence length (time steps):", dummy_output.shape[1])


    # Prepare output directory
    os.makedirs(config.model_path, exist_ok=True)

    # Define callbacks
    callbacks = [
        EarlyStopping(monitor="val_char_f1", patience=15, mode="max"), 
        ModelCheckpoint(f"{config.model_path}/model.h5", monitor="val_char_f1", save_best_only=True, mode="max"),
        TrainLogger(config.model_path), TensorBoard(log_dir=f"{config.model_path}/logs", update_freq='epoch', write_graph=True), 
        ReduceLROnPlateau(monitor="val_CER", factor=0.9, min_delta=1e-10, patience=5, verbose=1, mode="auto"), 
        Model2onnx(f"{config.model_path}/model.h5")
        ]
    
    # In main(), after dataset loading:
    print("\nSample Validation:")
    for i in range(3):
        img = cv2.imread(train_dataset[i][0])
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        plt.title(f"Label: {train_dataset[i][1]}")
        plt.show()

    # Train the model
    print("\nStarting training...")
    try:
        model.fit(
            train_data_provider,
            validation_data=val_data_provider,
            epochs=config.train_epochs,
            callbacks=callbacks
        )
    except Exception as e:
        print(f"\nTraining failed: {str(e)}")
        model.save(os.path.join(config.model_path, "interrupted_model.h5"))
        raise

    # Save final datasets
    train_data_provider.to_csv(os.path.join(config.model_path, "train.csv"))
    val_data_provider.to_csv(os.path.join(config.model_path, "val.csv"))

    print("\nTraining completed successfully!")

    # Any image from dataset
    img_path = train_dataset[0][0]  
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

    plt.imshow(img, cmap='gray')
    plt.title(f"True Label: {train_dataset[0][1]}")
    plt.show()

    print("First 5 training labels:")
    for i in range(5):
        print(f"{train_dataset[i][0]} → {train_dataset[i][1]}")

    results = model.evaluate(val_data_provider)
    print("Validation results:", results)

    # After training or in validation loop:
    batch = next(iter(val_data_provider))
    images, labels = batch

    predictions = model.predict(images)
    pred_texts = decode_predictions(predictions, config.vocab)

    true_texts = labels_to_texts(labels, config.vocab)

    visualize_predictions(images, true_texts, pred_texts, num=5)

if __name__ == "__main__":
    main()

