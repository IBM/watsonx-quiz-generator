from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from generate_quiz import extract_text_from_pdf, generate_quiz
from utils import clean_text
import os

app = FastAPI()

# Add CORS middleware for handling requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust allowed origins as needed
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for saving uploaded files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the backend API"}


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(None),
    content: str = Form(None),
    difficulty: str = Form(...),
    no_of_questions: str = Form(...),
    additional_contents: str = Form(None),
):
    if not additional_contents:
        additional_contents = "Be concise and keep the questions unique."
    # Process the input
    if file:
        # Validate file type
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

        file_data = await file.read()  # Read the file content

        with open(f"uploads/{file.filename}", "wb") as f:
            f.write(file_data)

        current_path = Path.cwd()
        file_path = current_path / "uploads" / f"{file.filename}"

        print("Processing File")
        processed_text = extract_text_from_pdf(file_path)  # Extract text from PDF
        print("File Processed")

        variables = {
            "content": processed_text,
            "difficulty": difficulty,
            "no_of_questions": no_of_questions,
            "additional_contents": additional_contents,
        }

        print("Generating Quiz")

        try:
            generated_quiz = generate_quiz(variables)
        except Exception as e:
            print(f"Error generating quiz: {e}")
            raise HTTPException(
                status_code=500, detail="Failed to generate quiz"
            ) from e

        finally:
            # Delete the file after processing
            if os.path.exists(file_path):
                os.remove(file_path)

        return {
            "generated_quiz": generated_quiz,
        }

    else:
        processed_text = clean_text(content)

        variables = {
            "content": processed_text,
            "difficulty": difficulty,
            "no_of_questions": no_of_questions,
            "additional_contents": additional_contents,
        }

        print("Generating Quiz")

        try:
            generated_quiz = generate_quiz(variables)
        except Exception as e:
            print(f"Error generating quiz: {e}")
            raise HTTPException(
                status_code=500, detail="Failed to generate quiz"
            ) from e

        return {
            "generated_quiz": generated_quiz,
        }
