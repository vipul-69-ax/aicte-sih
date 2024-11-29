import PyPDF2
from sentence_transformers import SentenceTransformer
import json

def process_pdf(pdf_path):
    # Extract text from PDF
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()

    # Split text into chunks
    chunks = split_into_chunks(text, chunk_size=1000, overlap=200)

    # Generate embeddings
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(chunks)

    # Save chunks and embeddings
    data = [{"chunk": chunk, "embedding": embedding.tolist()} for chunk, embedding in zip(chunks, embeddings)]
    with open('handbook_data.json', 'w') as f:
        json.dump(data, f)

def split_into_chunks(text, chunk_size, overlap):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

if __name__ == "__main__":
    process_pdf("APH Final.pdf")