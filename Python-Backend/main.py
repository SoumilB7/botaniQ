from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests
import json
import base64

app = FastAPI()



@app.get("/")
async def read_root():
    return {"Master": "Start the image classification backend","Assistant":"yes senpai I am going to start"}

@app.post("/image-classify/")
async def image_classify(
        request: Request
    ):
    raw_body = await request.body()
    decoded_body = raw_body.decode("utf-8",errors = "replace")
    image_cla = json.loads(decoded_body).get("image")
    image_cla = base64.b64decode(image_cla)
    content = requests.get()
    return content

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