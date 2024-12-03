from fastapi import FastAPI, HTTPException
import nest_asyncio
from fastapi import Request
from sse_starlette.sse import EventSourceResponse
from app.document_data import check_with_groq, compare_layouts
from app.utils import PDFComparisonRequest, download_pdf
import logging
import json
from groq import Groq 
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

nest_asyncio.apply()

groq_api_key = "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"

app = FastAPI()

@app.get("/")
def index_route():
    return "Welcome to Backend"

@app.post("/compare-pdfs")
async def compare_pdfs(request: PDFComparisonRequest):
    try:
        template_path = await download_pdf(request.template_url)
        filled_path = await download_pdf(request.filled_url)

        layouts_similar, placeholder_values, layout_issues = compare_layouts(template_path, filled_path)

        # Check with Groq AI
        placeholder_values = check_with_groq(placeholder_values)

        result = {
            "layouts_similar": layouts_similar,
            "placeholder_values": placeholder_values
        }

        if not layouts_similar:
            result["layout_issues"] = layout_issues

        return result
    except Exception as e:
        logging.error(f"Error processing PDFs: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/chat")
async def chat(request: Request):
    async def event_generator():
        client = Groq(api_key=groq_api_key)
        body = await request.json()
        user_message = body.get("message", "")
        pdf_data = body.get("pdf_data", {})

        prompt = f"""
        You are an AI assistant specialized in analyzing PDF documents. Use the following information about the PDF to answer the user's question:

        PDF Data:
        {json.dumps(pdf_data, indent=2)}

        User Question: {user_message}

        Provide a detailed and helpful response based on the PDF data and the user's question.
        """

        try:
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1024,
                top_p=1,
                stream=True,
            )

            for chunk in completion:
                if chunk.choices[0].delta.content is not None:
                    yield {"data": json.dumps({"content": chunk.choices[0].delta.content})}

        except Exception as e:
            logging.error(f"Error in chat: {e}")
            yield {"data": json.dumps({"error": str(e)})}

    return EventSourceResponse(event_generator())
