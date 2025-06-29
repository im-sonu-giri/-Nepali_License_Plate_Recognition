import tensorflow as tf

image = tf.io.read_file("image.jpg")
image = tf.image.decode_jpeg(image,channels=3)

grayscale_image = convert_to_grayscale(image)     


def convert_to_grayscale(image):
    gray_image = tf.image.rgb_to_grayscale(image)
    return gray_image
