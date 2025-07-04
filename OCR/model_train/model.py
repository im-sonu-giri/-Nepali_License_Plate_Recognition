from keras import layers
from keras.models import Model

from residual_block import residual_block

def train_model(input_dimen, output_dimen, activation='leaky_relu', dropout=0.3):
    
    inputs = layers.Input(shape=input_dimen, name="input")        

    input_norm = layers.Rescaling(1./255, offset=-0.5)(inputs)

    x1 = residual_block(input_norm, 32, activation=activation, skip_conv=True, strides=1, dropout=dropout)
    x2 = residual_block(x1, 32, activation=activation, skip_conv=False, strides=(2,1), dropout=dropout)
   
    x3 = residual_block(x2, 64, activation=activation, skip_conv=True, strides=1, dropout=dropout)
    x4 = residual_block(x3, 64, activation=activation, skip_conv=False, strides=(2,1), dropout=dropout)
   
    x5 = residual_block(x4, 128, activation=activation, skip_conv=True, strides=1, dropout=dropout)
    x6 = residual_block(x5, 128, activation=activation, skip_conv=False, strides=(2,1), dropout=dropout)
  
    x7 = residual_block(x6, 256, activation=activation, skip_conv=True, strides=1, dropout=dropout)
    x8 = residual_block(x7, 256, activation=activation, skip_conv=False, strides=(2,1), dropout=dropout)

    squeezed = layers.Reshape((x8.shape[2], -1))(x8)

    blstm1 = layers.Bidirectional(layers.LSTM(256, return_sequences=True, dropout=dropout, kernel_initializer='he_normal'))(squeezed)
    blstm2 = layers.Bidirectional(layers.LSTM(128, return_sequences=True, dropout=dropout))(blstm1)
    
    # Multi-Head Attention for Character Relationships
    attention = layers.MultiHeadAttention(num_heads=4, key_dim=64)(blstm2, blstm2)
    merged = layers.Concatenate()([blstm2, attention])

    dense = layers.Dense(128, activation='swish')(merged)
    output = layers.TimeDistributed(layers.Dense(output_dimen + 1, activation='softmax', name="output"))(dense)
   
    model = Model(inputs=inputs, outputs=output)
    return model
