import os
import cv2
from ultralytics import YOLO
model=YOLO(r"run_gpu/weights/best.pt")
input_dir="myimages"
output_dir="cropped_plates"
os.makedirs(output_dir,exist_ok=True)

for filename in os.listdir(input_dir):