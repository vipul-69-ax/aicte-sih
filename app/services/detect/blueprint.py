import cv2
import numpy as np
import easyocr
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import re

app = FastAPI()

class ImageURL(BaseModel):
    url: str

reader = easyocr.Reader(["en"], gpu=False)  # Initialize EasyOCR Reader

def download_image(url):
    """
    Downloads an image from a given URL.
    Args:
        url (str): URL of the image.
    Returns:
        numpy.ndarray: The downloaded image as a numpy array.
    """
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise exception for HTTP errors
        image_data = np.frombuffer(response.content, np.uint8)
        image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {e}")

def extract_dimensions(image):
    """
    Uses EasyOCR to extract text and identifies potential dimensions.
    Args:
        image (numpy.ndarray): Image of the blueprint.
    Returns:
        tuple: Width and height of the room (in feet or meters).
    """
    # Convert image to grayscale for better OCR performance
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use EasyOCR to extract text
    results = reader.readtext(gray)

    # Extract text and filter for dimensions
    dimension_texts = []
    for _, text, _ in results:
        if re.search(r"(\d+['″′xX×.\s]+)", text):  # Match dimension-like text
            dimension_texts.append(text)

    # If we find less than two dimensions, raise an error
    if len(dimension_texts) < 2:
        raise ValueError("Could not find sufficient dimensions in the blueprint.")

    # Extract and process dimensions
    dimensions = []
    for dim_text in dimension_texts:
        # Parse dimension values (e.g., '8′' to 8, '10.2m' to 10.2, etc.)
        match = re.search(r"(\d+(\.\d+)?)", dim_text)
        if match:
            dimensions.append(float(match.group(1)))

    # Sort and pick the two largest dimensions as width and height
    dimensions.sort(reverse=True)
    width, height = dimensions[:2]

    return width, height

