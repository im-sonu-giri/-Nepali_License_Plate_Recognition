import cv2
import numpy as np
import matplotlib.pyplot as plt
from model_train.data_utils import decode_predictions

def demo_random_val_sample(model, val_dataset, vocab, width=256, height=32):
    import random
    img_path, true_label = random.choice(val_dataset)
    
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    
    img_resized = cv2.resize(img, (width, height))
    
    img_resized = img_resized.astype(np.float32) / 255.0
    
    input_img = np.expand_dims(img_resized, axis=(0, -1))
    
    pred = model.predict(input_img)
    pred_text = decode_predictions(pred, vocab)[0]
    
    print(f"\n Random Validation Sample:\n→ True: {true_label}\n→ Pred: {pred_text}")
    
    plt.imshow(img_resized, cmap='gray')
    plt.title(f"True: {true_label}\nPred: {pred_text}")
    plt.axis('off')
    plt.show()
