
import os
from tqdm import tqdm
import tensorflow as tf

try:
    [tf.config.experimental.set_memory_growth(gpu, True)
     for gpu in tf.config.experimental.list_physical_devices("GPU")]
except:
    pass

data_path = "Datasets"
train_annotation_path = os.path.join(data_path, "annotation.train.txt")
val_annotation_path = os.path.join(data_path, "annotation.val.txt")


def read_dataset(image_list_path, data_path):

    import regex
    dataset, vocab, max_len = [], set(), 0

    with open(image_list_path, "r", encoding="utf-8") as f:
        image_paths = [line.strip() for line in f]

    for img_rel_path in image_paths:
            img_path = os.path.join(data_path, img_rel_path)
            label_path = img_path.replace(".jpg", ".txt")
            with open(label_path, "r", encoding="utf-8") as lf:
                label = lf.read().strip()

            tokens = regex.findall(r'\X', label)
            dataset.append([img_path, label])
            vocab.update(tokens)
            max_len = max(max_len, len(tokens))

    return dataset, sorted(vocab), max_len


train_dataset, train_vocab, max_train_len = read_dataset(train_annotation_path, data_path)
val_dataset, val_vocab, max_val_len = read_dataset(val_annotation_path, data_path)

import config

config.vocab = "".join(train_vocab)
config.max_text_length = max(max_train_len, max_val_len)
config.save()

from mltu.preprocessors import ImageReader
from mltu.annotations.images import CVImage
from mltu.transformers import ImageResizer, LabelIndexer, LabelPadding
from mltu.tensorflow.dataProvider import DataProvider

model_train_data_provider = DataProvider(
    dataset=train_dataset,
    skip_validation=True,
    batch_size=config.batch_size,
    data_preprocessors=[ImageReader(CVImage)],
    transformers=[
        ImageResizer(config.width, config.height),
        LabelIndexer(config.vocab),
        LabelPadding(max_word_length=config.max_text_length, padding_value=len(config.vocab))
        ],
)

model_val_data_provider = DataProvider(
    dataset=val_dataset,
    skip_validation=True,
    batch_size=config.batch_size,
    data_preprocessors=[ImageReader(CVImage)],
    transformers=[
        ImageResizer(config.width, config.height),
        LabelIndexer(config.vocab),
        LabelPadding(max_word_length=config.max_text_length, padding_value=len(config.vocab))
        ],
)

from model import train_model

model = train_model(
     input_dimen = (config.height, config.width, 1),
     output_dimen = len(config.vocab)
)

from ctc_loss import CTCloss
from mltu.tensorflow.metrics import CWERMetric


model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=config.learning_rate), 
    loss=CTCloss(), 
    metrics=[CWERMetric()],
    run_eagerly=False
)

model.summary(line_length=110)

os.makedirs(config.model_path, exist_ok=True)

