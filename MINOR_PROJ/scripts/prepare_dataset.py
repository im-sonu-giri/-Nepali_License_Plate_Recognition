import os
from tqdm import tqdm
import tensorflow as tf

data_path = "/home/lamin/MINOR_PROJ/Datasets"

train_annotation_path = os.path.join(data_path, "annotation.train.txt")
val_annotation_path = os.path.join(data_path, "annotation.val.txt")


def read_dataset(image_list_path, data_path):

    import regex
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


train_dataset, train_vocab, max_train_len = read_dataset(train_annotation_path, data_path)
val_dataset, val_vocab, max_val_len = read_dataset(val_annotation_path, data_path)

with open("vocab.txt", "w", encoding="utf-8") as f:
    for token in train_vocab:
        f.write(token + "\n")
