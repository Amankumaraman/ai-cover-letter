from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

import os
import pdfplumber
import docx
from groq import Groq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

resume_text_store = ""

def parse_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def parse_docx(file):
    doc = docx.Document(file)
    return "\n".join(p.text for p in doc.paragraphs)


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    global resume_text_store

    if file.filename.endswith(".pdf"):
        resume_text_store = parse_pdf(file.file)

    elif file.filename.endswith(".docx"):
        resume_text_store = parse_docx(file.file)

    else:
        return {"error": "unsupported file"}

    return {"message": "resume uploaded"}


@app.post("/generate-cover-letter")
async def generate_cover_letter(job_description: str = Form(...)):

    prompt = f"""
Write a professional, ATS-optimized cover letter.

Candidate Resume:
{resume_text_store}

Job Description:
{job_description}

Instructions:
- match candidate skills with job requirements
- highlight relevant achievements
- keep professional tone
- length 200-300 words
- avoid generic phrases
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return {
        "cover_letter": completion.choices[0].message.content
    }
