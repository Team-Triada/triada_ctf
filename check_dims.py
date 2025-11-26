import os
from PIL import Image

images = [
    "images/event_12 (1).png",
    "images/event_12 (2).png",
    "images/event_12 (3).png",
    "images/event_12 (4).png",
    "images/event_12 (5).png",
    "images/event_12 (6).png"
]

for img_path in images:
    try:
        with Image.open(img_path) as img:
            print(f"{img_path}: {img.size}")
    except Exception as e:
        print(f"Error reading {img_path}: {e}")
