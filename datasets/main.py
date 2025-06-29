import os
import cv2
import shutil
from pathlib import Path

RAW_IMAGE_DIR = "raw_images"
CLEANED_DIR = "cleaned"
LABEL_DIR = "labels"

# Create necessary directories
Path(CLEANED_DIR).mkdir(parents=True, exist_ok=True)
Path(LABEL_DIR).mkdir(parents=True, exist_ok=True)

def is_blurry(image, threshold=100.0):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    score = cv2.Laplacian(gray, cv2.CV_64F).var()
    return score < threshold

def is_too_small(image, min_width=100, min_height=40):
    h, w = image.shape[:2]
    return w < min_width or h < min_height

def clean_dataset(max_images=600):
    selected = 0
    total = 0

    for filename in os.listdir(RAW_IMAGE_DIR):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        image_path = os.path.join(RAW_IMAGE_DIR, filename)
        image = cv2.imread(image_path)

        if image is None:
            print(f"Could not load: {filename}")
            continue

        total += 1

        if is_blurry(image):
            print(f"Blurry image skipped: {filename}")
            continue

        if is_too_small(image):
            print(f"Image too small: {filename} - size: {image.shape[:2]}")
            continue

        # Copy cleaned image
        shutil.copy(image_path, os.path.join(CLEANED_DIR, filename))

        # Create placeholder label
        label_filename = os.path.splitext(filename)[0] + '.txt'
        label_path = os.path.join(LABEL_DIR, label_filename)

        with open(label_path, 'w', encoding='utf-8') as f:
            f.write("नं-plate")  # Replace with actual label when available

        selected += 1
        if selected >= max_images:
            break

    print("\nCleaning process completed.")
    print(f"Total images processed: {total}")
    print(f"Number of valid images selected: {selected}")
    print(f"Cleaned images saved in: {CLEANED_DIR}")
    print(f"Label files saved in: {LABEL_DIR}")

if __name__ == "__main__":
    clean_dataset()
