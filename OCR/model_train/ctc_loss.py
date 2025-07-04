
import tensorflow as tf

class CTCloss(tf.keras.losses.Loss):
      
    def __init__(self, name: str = 'CTCloss', blank_index: int = -1) -> None:
        super().__init__(name=name)
        self.blank_index = blank_index 
        self.epsilon = 1e-7

        self.input_len = None
        self.label_len = None

    def call(self, y_true, y_pred):
        batch_size = tf.shape(y_true)[0]
        time_steps = tf.shape(y_pred)[1]

        y_pred = tf.math.log(tf.clip_by_value(y_pred, self.epsilon, 1.))

        # Dynamic length calculation 
        if self.input_len is None or self.input_len.shape[0] != batch_size:
            self.input_len = tf.fill([batch_size, 1], tf.cast(time_steps, tf.int32))
            self.label_len = tf.math.count_nonzero(
                tf.cast(y_true != self.blank_index, tf.int32),
                axis=1,
                keepdims=True
            )

        # Numerically stable CTC calculation
        loss = tf.keras.backend.ctc_batch_cost(
            y_true, y_pred, 
            input_length=self.input_len,
            label_length=self.label_len
        )
        
        # Batch normalization and clipping
        return tf.clip_by_value(loss, 0., 1e6)
    
    def get_config(self):
        config = super().get_config()
        config.update({"blank_index": self.blank_index})
        return config