import cv2
import tensorflow as tf
import numpy as np
from albumentations import Compose, RandomBrightnessContrast, GaussianBlur, ShiftScaleRotate
from mltu.preprocessors import ImageReader

def get_augmenter():
    return Compose([
        RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.5),
        GaussianBlur(blur_limit=(1, 3), p=0.3),
        ShiftScaleRotate(rotate_limit=5, scale_limit=0.1, p=0.5),
    ])

class GrayscaleImageReader(ImageReader):
    def __init__(self):
        super().__init__(image_class=np.ndarray)
        self.augmenter = get_augmenter() 

    def __call__(self, image_path: str, annotation=None):
        color_img = cv2.imread(image_path)
        if color_img is None:
            raise ValueError(f"Could not read image at {image_path}")
            
        augmented = self.augmenter(image=color_img)
        color_img = augmented['image']
        
        gray_img = cv2.cvtColor(color_img, cv2.COLOR_BGR2GRAY)
        gray_img = gray_img.astype(np.float32) / 255.0  
        
        gray_img = np.expand_dims(gray_img, axis=-1)
        
        return gray_img, annotation
