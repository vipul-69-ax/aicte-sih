from fastapi import APIRouter, HTTPException
from ultralytics import YOLO
import torch
import cv2
import numpy as np
import requests

router = APIRouter()

try:
    model = YOLO('/home/hp/Desktop/models/app/data/best.pt')  # Load pretrained model
    model.to('cuda' if torch.cuda.is_available() else 'cpu')  # Move to GPU if available
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise


def process_image(image_bytes):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


@router.post("/")
async def detect_objects(image_request):
    try:
        # Download image from URL
        response = requests.get(image_request.url)
        response.raise_for_status()
        img = process_image(response.content)
        
        # Run inference
        results = model(img)
        
        # Process results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detection = {
                    "bbox": box.xyxy[0].tolist(),  # Convert bbox to list
                    "confidence": float(box.conf),  # Convert confidence to float
                    "class": int(box.cls),  # Get predicted class
                    "class_name": result.names[int(box.cls)]  # Get class name
                }
                detections.append(detection)
        
        return {
            "status": "success",
            "detections": detections,
            "model_info": {
                "device": str(next(model.parameters()).device),
                "num_detections": len(detections)
            }
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
