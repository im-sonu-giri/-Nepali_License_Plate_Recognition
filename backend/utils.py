import cv2
import base64

def convert_image_to_base64(image):
    _, buffer = cv2.imencode('.jpg', image)
    base64_img = base64.b64encode(buffer).decode("utf-8")
    return base64_img