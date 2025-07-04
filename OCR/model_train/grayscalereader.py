from mltu.preprocessors import ImageReader
import tensorflow as tf
import numpy as np

class GrayscaleImageReader(ImageReader):
    def __init__(self):
        super().__init__(image_class=np.ndarray)

    def __call__(self, image_path: str, annotation=None):
        image = tf.io.read_file(image_path)
        image = tf.image.decode_jpeg(image, channels=3)
        image = tf.image.rgb_to_grayscale(image)
        image_np = image.numpy().squeeze()

        # Ensure output shape: (H, W, 1) for grayscale
        if image_np.ndim == 2:
            image_np = np.expand_dims(image_np, axis=-1)

        return image_np, annotation
