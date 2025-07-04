
import tensorflow as tf

class CTCloss(tf.keras.losses.Loss):
      
    def __init__(self, name: str = 'CTCloss') -> None:
        super().__init__(name=name)
        self.ctc = tf.keras.backend.ctc_batch_cost

    def call(self, y_true, y_pred):
        B = tf.shape(y_true)[0]
        T = tf.shape(y_pred)[1]

        input_len  = tf.fill([B, 1], tf.cast(T, tf.int64))
        label_len  = tf.math.count_nonzero(y_true + 1, axis=1, keepdims=True, dtype=tf.int64)
        return self.ctc(y_true, y_pred, input_len, label_len)