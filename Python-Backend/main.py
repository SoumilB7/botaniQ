from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
import cv2
import pickle
import requests
import json
import base64



IMG_SIZE = 128

# Model load ---------
model_img = tf.keras.models.load_model("base_model.keras")
with open("image_classifier.pkl", "rb") as f:
    label_encoder_img = pickle.load(f)

# -------

model_hlt = tf.keras.models.load_model("plant_health_model.keras")
with open("planthealth.pkl", "rb") as f:
    label_encoder_hlt = pickle.load(f)
with open("scaler.pkl", "rb") as f:
    scaler_hlt = pickle.load(f)

# --------------------



def preprocess_base64_image(base64_str):
    image_bytes = base64.b64decode(base64_str)
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0  
    return img
def predict_base64_image(base64_str):
    img = preprocess_base64_image(base64_str)
    img = np.expand_dims(img, axis=0)  
    pred = model_img.predict(img)
    pred_label = np.argmax(pred, axis=1)[0]
    class_name = label_encoder_img.inverse_transform([pred_label])[0]
    return class_name

def predict_health(soil_moisture, ambient_temp, soil_temp, humidity, light_intensity):
    input_data = np.array([[soil_moisture, ambient_temp, soil_temp, humidity, light_intensity]])
    input_data = scaler_hlt.transform(input_data) 
    prediction = model_hlt.predict(input_data)
    predicted_class = np.argmax(prediction, axis=1)[0]
    return label_encoder_hlt.inverse_transform([predicted_class])[0]


app = FastAPI()



@app.get("/")
async def read_root():
    return {"Master": "Start the image classification backend","Assistant":"yes senpai I am going to start"}

@app.post("/image-classify/")
async def image_classify(
        request: Request
    ):
    raw_body = await request.body()
    decoded_body = raw_body.decode("utf-8", errors="replace")
    image_base64 = json.loads(decoded_body).get("image")
    prediction = predict_base64_image(image_base64)
    output = {"Predicted-class": prediction}
    print(output)
    return output

@app.post("/health-detect/")
async def health_detect(
        request: Request
    ):
    raw_body = await request.body()
    decoded_body = raw_body.decode("utf-8", errors="replace")
    data = json.loads(decoded_body)

    soil_moisture = data.get("Soil_Moisture")
    ambient_temp = data.get("Ambient_Temperature")
    soil_temp = data.get("Soil_Temperature")
    humidity = data.get("Humidity")
    light_intensity = data.get("Light_Intensity")

    if None in [soil_moisture, ambient_temp, soil_temp, humidity, light_intensity]:
        return {"error": "Missing input data"}
    predicted_status = predict_health(soil_moisture, ambient_temp, soil_temp, humidity, light_intensity)
    return {"Predicted_Health_Status": predicted_status}