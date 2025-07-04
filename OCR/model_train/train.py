import sys
import os
import regex

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from tqdm import tqdm
import tensorflow as tf

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
config = ModelConfiguration()

# Defining paths
data_path = "../Datasets"
train_annotation_path = os.path.join(data_path, "annotation.train.txt")
val_annotation_path = os.path.join(data_path, "annotation.val.txt")

# Read Dataset and Extract Vocabulary from Labels
def read_dataset(image_list_path, data_path):
    dataset, vocab, max_len = [], set(), 0

    with open(image_list_path, "r", encoding="utf-8") as f:
        image_paths = [line.strip() for line in f]

    for img_rel_path in image_paths:
        img_path = os.path.join(data_path, img_rel_path)
        label_filename = os.path.basename(img_path).replace(".jpg", ".txt")
        label_path = os.path.join(data_path, "labels", label_filename)
        with open(label_path, "r", encoding="utf-8") as lf:
            label = lf.read().strip()
        tokens = regex.findall(r'\X', label)
        dataset.append([img_path, label])
        vocab.update(tokens)
        max_len = max(max_len, len(tokens))

    return dataset, sorted(vocab), max_len

# Split into training and validation
train_dataset, train_vocab, max_train_len = read_dataset(train_annotation_path, data_path)
val_dataset, val_vocab, max_val_len = read_dataset(val_annotation_path, data_path)

config.vocab = "".join(train_vocab)
config.max_text_length = max(max_train_len, max_val_len)
config.save()

# Create data provider for model training
model_train_data_provider = DataProvider(
    dataset=train_dataset,
    skip_validation=True,
    shuffle=True,
    batch_size=config.batch_size,
    data_preprocessors=[GrayscaleImageReader()],
    transformers=[
        NumpyImageResizer(config.width, config.height),
        LabelIndexer(config.vocab),
        LabelPadding(max_word_length=config.max_text_length, padding_value=-1)
    ]
)

# Create data provider for model validation
model_val_data_provider = DataProvider(
    dataset=val_dataset,
    skip_validation=True,
    batch_size=config.batch_size,
    data_preprocessors=[GrayscaleImageReader()],
    transformers=[
        NumpyImageResizer(config.width, config.height),
        LabelIndexer(config.vocab),
        LabelPadding(max_word_length=config.max_text_length, padding_value=-1)
    ]
)

# Model Initialization
model = train_model(
    input_dimen=(config.height, config.width, 1),
    output_dimen=len(config.vocab)+1
)

# Compile model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=config.learning_rate),
    loss=CTCloss(),
    metrics=[
        CWERMetric(padding_token=-1),
        CharPRF1(pad=-1)
    ],  
    run_eagerly=False
)

model.summary(line_length=110)

os.makedirs(config.model_path, exist_ok=True)

# Define callbacks
earlystopper = EarlyStopping(monitor="val_CER", patience=10, verbose=1, mode="min")
checkpoint = ModelCheckpoint(f"{config.model_path}/model.h5", monitor="val_CER", verbose=1, save_best_only=True, mode="min",  save_weights_only=False)
trainLogger = TrainLogger(config.model_path)
tb_callback = TensorBoard(log_dir=f"{config.model_path}/logs", update_freq='epoch', write_graph=True)
reduceLROnPlat = ReduceLROnPlateau(monitor="val_CER", factor=0.9, min_delta=1e-10, patience=5, verbose=1, mode="auto")
model2onnx = Model2onnx(f"{config.model_path}/model.h5")

val_list = model_val_data_provider.dataset

val_dataset = tf.data.Dataset.from_tensor_slices(tuple(zip(*val_list)))
val_dataset = val_dataset.batch(config.batch_size)  

# Train the model
model.fit(
    model_train_data_provider,
    validation_data=model_val_data_provider,
    epochs=config.train_epochs,
     callbacks=[
        earlystopper,
        checkpoint,
        trainLogger,
        reduceLROnPlat,
        tb_callback,
        model2onnx,
        ConfMatrixCallback(
            val_data=model_val_data_provider._dataset,
            charset=config.vocab,
            pad=-1,
            log_dir=f"{config.model_path}/logs"
        )
    ]
    )

# Optionally save datasets
model_train_data_provider.to_csv(os.path.join(config.model_path, "train.csv"))
model_val_data_provider.to_csv(os.path.join(config.model_path, "val.csv"))
