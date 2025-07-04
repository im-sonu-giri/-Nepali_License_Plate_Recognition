from keras import layers

def residual_block(x, filters, activation='leaky_relu', skip_conv=False, strides=1, dropout=0.2):
    shortcut = x

    if activation == 'leaky_relu':
        act_fn = layers.LeakyReLU(negative_slope=0.1)
    else:
        act_fn = layers.Activation(activation)

    x = layers.Conv2D(filters, kernel_size=3, strides=strides, padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = act_fn(x)
    x = layers.Dropout(dropout)(x)

    x = layers.Conv2D(filters, kernel_size=3, strides=1, padding='same')(x)
    x = layers.BatchNormalization()(x)

    if skip_conv or strides != 1 or shortcut.shape[-1] != filters:
        shortcut = layers.Conv2D(filters, kernel_size=1, strides=strides, padding='same')(shortcut)
        shortcut = layers.BatchNormalization()(shortcut)

    x = layers.Add()([x, shortcut])
    x = act_fn(x)

    return x
