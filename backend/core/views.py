from django.http import JsonResponse
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import os

model_path = os.path.join(os.path.dirname(__file__), "age_gender_model.h5")
model = load_model(model_path)

def predict_age_gender(request):
    if request.method == "POST":
        image_file = request.FILES["image"]
        img = Image.open(image_file).resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = img_array.reshape(1, 128, 128, 3)
        predictions = model.predict(img_array)
        age = predictions[0][0][0]
        gender = "male" if predictions[1][0][0] > 0.5 else "female"
        return JsonResponse({"age": age, "gender": gender})
    return JsonResponse({"error": "Invalid request method"}, status=400)
