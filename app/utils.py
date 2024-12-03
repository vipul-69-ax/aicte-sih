from pydantic import BaseModel
import requests
import tempfile
from fastapi import HTTPException

class PDFComparisonRequest(BaseModel):
    template_url: str
    filled_url: str

async def download_pdf(url: str) -> str:
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to download PDF from {url}")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(response.content)
        return temp_file.name
    