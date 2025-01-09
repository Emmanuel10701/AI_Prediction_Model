import kagglehub
import os
import numpy as np
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, BatchNormalization
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from PIL import Image

# Dataset download
def download_dataset():
    path = kagglehub.dataset_download("jangedoo/utkface-new")
    return path

# Preprocess dataset
def preprocess_data(dataset_path, img_size=128):
    images, ages, genders = [], [], []
    for file in os.listdir(dataset_path):
        if file.endswith(".jpg"):
            parts = file.split("_")
            age = int(parts[0])
            gender = int(parts[1])  # 0: Female, 1: Male
            img = Image.open(os.path.join(dataset_path, file)).resize((img_size, img_size))
            images.append(np.array(img) / 255.0)
            ages.append(age)
            genders.append(gender)
    images = np.array(images)
    ages = np.array(ages)
    genders = np.array(genders)
    return images, ages, genders

# Build model
def create_model(input_shape):
    inputs = Input(shape=input_shape)
    x = Conv2D(32, (3, 3), activation="relu", padding="same")(inputs)
    x = MaxPooling2D((2, 2))(x)
    x = BatchNormalization()(x)
    x = Conv2D(64, (3, 3), activation="relu", padding="same")(x)
    x = MaxPooling2D((2, 2))(x)
    x = BatchNormalization()(x)
    x = Flatten()(x)
    age_output = Dense(1, activation="linear", name="age_output")(x)
    gender_output = Dense(1, activation="sigmoid", name="gender_output")(x)
    model = Model(inputs=inputs, outputs=[age_output, gender_output])
    return model
def train_model():
    dataset_path = download_dataset()
    images, ages, genders = preprocess_data(dataset_path)
    X_train, X_test, y_train_age, y_test_age, y_train_gender, y_test_gender = train_test_split(
        images, ages, genders, test_size=0.2, random_state=42
    )
    model = create_model((128, 128, 3))
    model.compile(
        optimizer="adam",
        loss={"age_output": "mse", "gender_output": "binary_crossentropy"},
        metrics={"age_output": "mae", "gender_output": "accuracy"},
    )
    model.fit(
        X_train,
        {"age_output": y_train_age, "gender_output": y_train_gender},
        validation_data=(X_test, {"age_output": y_test_age, "gender_output": y_test_gender}),
        epochs=10,
        batch_size=32,
    )
    model.save("age_gender_model.h5")
    return model
