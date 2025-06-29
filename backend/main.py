import os
import cv2
from ultralytics import YOLO
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, HTTPException


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins =["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#load yolo model
model=YOLO(r"run_gpu/weights/best.pt")

#input_dir="myimages"
output_dir="cropped_plates"
os.makedirs(output_dir,exist_ok=True)

#routes
@app.get("/")
def root():
    return{"message": "YOLO plate detection API is running"}

@app.post("/detect")
async def detect_plate(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)




#for filename in os.listdir(input_dir):
    #if filename.lower().endswith((".jpg",".png",".jpeg")):
        #image_path=os.path.join(input_dir,filename)
        #image=cv2.imread(image_path)

        if image is None:
            print(f"image cannot be read:{filename}")
            continue

        results=model(image)
        boxes=results[0].boxes

        if not boxes or len(boxes)==0:
            print(f"No license plate detected in :{filename}")
            continue

        for i, box in enumerate(boxes.xyxy):
            x1,y1,x2,y2 =map(int,box[:4])
            cropped=image[y1:y2,x1:x2]
            cropped_name=f"{os.path.splitext(filename)[0]}_plate{i}.jpg"
            output_path=os.path.join(output_dir,cropped_name)
            cv2.imwrite(output_path,cropped)
            print(f"saved {output_path}")

        print(f"Done processing: {filename}")





