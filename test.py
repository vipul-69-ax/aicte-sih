from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import requests
import cv2
import pytesseract
import re
import numpy as np
from pydantic import BaseModel

app = FastAPI()

class ImageURL(BaseModel):
    url: str

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
    Extracts dimensions from a blueprint image using OCR.
    Args:
        image (numpy.ndarray): Image of the blueprint.
    Returns:
        tuple: Width and height of the room (in feet).
    """
    # Convert to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply preprocessing (adaptive thresholding)
    processed_image = cv2.adaptiveThreshold(
        gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # Extract text from the processed image
    extracted_text = pytesseract.image_to_string(processed_image)

    # Define a regex pattern to match dimensions
    dimension_pattern = re.compile(
        r"\b(\d+(\.\d+)?(?:\s?\d+\/\d+)?)(?:['\"]?|ft|feet|x|×| |\b)"
    )

    # Find all potential dimensions in the text
    matches = dimension_pattern.findall(extracted_text)
    dimensions = [float(eval(match[0].replace(" ", "+"))) for match in matches]

    # Filter out irrelevant text by assuming the two largest numbers are the dimensions
    if len(dimensions) < 2:
        raise ValueError("Could not find sufficient dimensions in the blueprint.")

    dimensions.sort(reverse=True)  # Sort in descending order
    width, height = dimensions[:2]  # Take the two largest dimensions as width and height

    return width, height

def calculate_area(width, height):
    """
    Calculates the area of the room.
    Args:
        width (float): Width of the room in feet.
        height (float): Height of the room in feet.
    Returns:
        float: Area of the room in square feet.
    """
    return width * height

