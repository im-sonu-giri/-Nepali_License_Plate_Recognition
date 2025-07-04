from keras import layers
from keras.regularizers import l2


def residual_block(x, filters, activation='leaky_relu', skip_conv=False, strides=(1,1), dropout=0.2):
    shortcut = x

    if activation == 'leaky_relu':
        act_fn = layers.LeakyReLU(alpha=0.1)
    else:
        act_fn = layers.Activation(activation)

    x = layers.Conv2D(filters, kernel_size=3, strides=strides, padding='same',
                      kernel_initializer='he_normal', kernel_regularizer=l2(1e-4))(x)
    x = layers.BatchNormalization(epsilon=1.001e-5)(x)
    x = act_fn(x)
    x = layers.SpatialDropout2D(dropout)(x)

    x = layers.Conv2D(filters, kernel_size=3, strides=1, padding='same',
                      kernel_initializer='he_normal', kernel_regularizer=l2(1e-4))(x)
    x = layers.BatchNormalization(epsilon=1.001e-5)(x)

    if skip_conv or strides != (1,1) or shortcut.shape[-1] != filters:
        shortcut = layers.Conv2D(filters, kernel_size=1, strides=strides, padding='same',
                                 kernel_initializer='he_normal')(shortcut)
        shortcut = layers.BatchNormalization(epsilon=1.001e-5)(shortcut)

    x = layers.Add()([x, shortcut])
    x = act_fn(x)

    if filters >= 128:
        se = layers.GlobalAveragePooling2D()(x)
        se = layers.Dense(filters//8, activation='relu')(se)
        se = layers.Dense(filters, activation='sigmoid')(se)
        x = layers.Multiply()([x, se])

    return x
