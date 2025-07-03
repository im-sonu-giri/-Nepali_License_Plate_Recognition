import os
import cv2
from ultralytics import YOLO

model = YOLO(r"run_gpu/weights/best.pt")
def detect_plate(image):
#input_dir = "myimages"
#output_dir = "cropped_plates"
    results = model(image)
    boxes = results[0].boxes

    cropped_plates = []
    if boxes is None or len(boxes) == 0:
        return cropped_plates

    for box in boxes.xyxy:
        x1, y1, x2, y2 = map(int, box[:4])
        cropped = image[y1:y2, x1:x2] 
        cropped_plates.append(cropped)

    return cropped_plates
