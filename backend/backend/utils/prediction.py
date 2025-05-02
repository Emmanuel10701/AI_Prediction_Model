import os
import numpy as np
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, BatchNormalization
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from PIL import Image
import kagglehub

# Step 1: Download the dataset
def download_dataset():
    """
    Downloads the UTKFace dataset using kagglehub.
    Returns the path to the downloaded dataset.
    """
    path = kagglehub.dataset_download("jangedoo/utkface-new")
    return path

# Step 2: Preprocess the dataset
def preprocess_data(dataset_path, img_size=128):
    """
    Preprocesses the dataset by resizing images and normalizing pixel values.
    Extracts age and gender labels from filenames.

    Args:
        dataset_path (str): Path to the dataset directory.
        img_size (int): Size to which images will be resized.

    Returns:
        tuple: Arrays of images, ages, and genders.
    """
    images, ages, genders = [], [], []
    for file in os.listdir(dataset_path):
        if file.endswith(".jpg"):
            parts = file.split("_")
            age = int(parts[0])  # Extract age from filename
            gender = int(parts[1])  # Extract gender (0: Female, 1: Male)
            img = Image.open(os.path.join(dataset_path, file)).resize((img_size, img_size))
            images.append(np.array(img) / 255.0)  # Normalize pixel values
            ages.append(age)
            genders.append(gender)
    return np.array(images), np.array(ages), np.array(genders)

# Step 3: Build the model
def create_model(input_shape):
    """
    Creates a multi-output CNN model for age and gender prediction.

    Args:
        input_shape (tuple): Shape of the input images (height, width, channels).

    Returns:
        Model: A compiled Keras model.
    """
    inputs = Input(shape=input_shape)
    x = Conv2D(32, (3, 3), activation="relu", padding="same")(inputs)
    x = MaxPooling2D((2, 2))(x)
    x = BatchNormalization()(x)
    x = Conv2D(64, (3, 3), activation="relu", padding="same")(x)
    x = MaxPooling2D((2, 2))(x)
    x = BatchNormalization()(x)
    x = Flatten()(x)

    # Output layers
    age_output = Dense(1, activation="linear", name="age_output")(x)  # Regression for age
    gender_output = Dense(1, activation="sigmoid", name="gender_output")(x)  # Binary classification for gender

    # Create the model
    model = Model(inputs=inputs, outputs=[age_output, gender_output])
    return model

# Step 4: Train the model
def train_model():
    """
    Trains the age and gender prediction model.

    Returns:
        Model: The trained Keras model.
    """
    # Download and preprocess the dataset
    print("Downloading dataset...")
    dataset_path = download_dataset()
    print("Preprocessing data...")
    images, ages, genders = preprocess_data(dataset_path)

    # Split the data into training and testing sets
    print("Splitting data...")
    X_train, X_test, y_train_age, y_test_age, y_train_gender, y_test_gender = train_test_split(
        images, ages, genders, test_size=0.2, random_state=42
    )

    # Create the model
    print("Creating model...")
    model = create_model((128, 128, 3))

    # Compile the model
    model.compile(
        optimizer="adam",
        loss={"age_output": "mse", "gender_output": "binary_crossentropy"},
        metrics={"age_output": "mae", "gender_output": "accuracy"},
    )

    # Train the model
    print("Training model...")
    model.fit(
        X_train,
        {"age_output": y_train_age, "gender_output": y_train_gender},
        validation_data=(X_test, {"age_output": y_test_age, "gender_output": y_test_gender}),
        epochs=10,
        batch_size=32,
    )

    # Save the trained model
    print("Saving model...")
    model.save("age_gender_model.h5")
    print("Model training complete!")
    return model

# Run the training process
if __name__ == "__main__":
    train_model()