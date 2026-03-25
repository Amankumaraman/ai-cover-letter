# AI Cover Letter Generator

Generate ATS-friendly cover letters from a resume and a job description.

## Features
- Upload resume (PDF or DOCX)
- Paste job description
- Get a tailored, professional cover letter

## Tech Stack
- Frontend: React
- Backend: FastAPI
- LLM: Groq

## Setup

### 1) Backend
From the repo root:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the repo root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Run the API:

```bash
uvicorn main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`.

### 2) Frontend
From the repo root:

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://127.0.0.1:3000`.

## Notes
- `.env.example` is provided as a template.
- Make sure the backend is running before generating a cover letter.
