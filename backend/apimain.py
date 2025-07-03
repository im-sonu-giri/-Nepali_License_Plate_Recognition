from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


import numpy as np
import cv2
import base64

from main import detect_plate
from ocr_dummy import extract_text
from utils import convert_image_to_base64
from yolov8_model import detect_plate

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    cropped_plates = detect_plate(image)

    
    if not cropped_plates:
        return{"message": "no plates detected", "count":0}
    
    cropped = cropped_plates[0]
    text = extract_text(cropped)
    img_base64 = convert_image_to_base64(cropped)

    return{
        "message": "plate detected",
        "count": len(cropped_plates),
        "cropped_image": img_base64,
        "text": text
    }

if __name__ =="__main__":

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000,reload=True)
