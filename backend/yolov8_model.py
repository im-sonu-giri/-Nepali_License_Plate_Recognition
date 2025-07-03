from ultralytics import YOLO

model = YOLO(r"run_gpu/weights/best.pt")

def detect_plate(image):
    results = model(image)
    boxes = results[0].boxes

    cropped_plates = []

    height, width, _ = image.shape

    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(width, x2)
        y2 = min(height, y2)

        if x2 > x1 and y2 > y1:
            cropped = image[y1:y2, x1:x2]
            cropped_plates.append(cropped)

    return cropped_plates
