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
model = tf.keras.models.load_model("base_model.keras")
with open("image_classifier.pkl", "rb") as f:
    label_encoder = pickle.load(f)
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
    pred = model.predict(img)
    pred_label = np.argmax(pred, axis=1)[0]
    class_name = label_encoder.inverse_transform([pred_label])[0]
    return class_name




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
    return output

@app.post("/disease-detect/")
async def disease_detect(
        request: Request
    ):
    raw_body = await request.body()
    decoded_body = raw_body.decode("utf-8",errors = "replace")
    image_dis = json.loads(decoded_body).get("image")
    image_dis = base64.b64decode(image_dis)
    content = requests.get()
    return content