import tensorflow as tf

image = tf.io.read_file("image.jpg")
image = tf.image.decode_jpeg(image,channels=3)

gray_image = tf.image.rgb_to_grayscale(image)

gray_image_encoded = tf.image.encode_jpeg(tf.squeeze(gray_image, axis=-1))

tf.io.write_file("grayscale_image.jpg", gray_image_encoded)
