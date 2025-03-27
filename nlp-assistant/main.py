from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from transformers import pipeline, Pipeline
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

TASK = os.getenv("HF_TASK", "question-answering")
MODEL = os.getenv("HF_MODEL", "distilbert-base-cased-distilled-squad")
logger.debug(f"Initializing with TASK={TASK}, MODEL={MODEL}")

try:
    nlp: Pipeline = pipeline(task=TASK, model=MODEL)
    logger.info(f"Model loaded successfully: {nlp.task}")
except Exception as e:
    logger.error(f"Failed to load model: {e}", exc_info=True)
    raise RuntimeError(f"Failed to load model: {e}")

class TextInput(BaseModel):
    text: str

# Define the /nlp route
@app.get("/nlp")
async def get_nlp():
    return {"message": "NLP assistant is running"}

# Define the /analyze route
@app.post("/analyze")
async def analyze_text(input: TextInput, request: Request):
    try:
        raw_body = await request.body()
        logger.debug(f"Raw request body: {raw_body}")
        logger.debug(f"Received input: {input.text}")
        if not input.text.strip():
            raise ValueError("Input text cannot be empty")
        
        if TASK == "question-answering":
            context = """
            Docker is a platform that enables developers to build, package, and run applications in lightweight containers.
            ENTRYPOINT is a Docker instruction that sets the main command to run when a container starts.
            """
            logger.debug("Calling pipeline with question and context")
            result = nlp(question=input.text, context=context)
            logger.debug(f"Pipeline result: {result}")
        else:
            result = nlp(input.text)

        logger.debug(f"Result: {result}")
        return {"task": TASK, "result": result}
    except Exception as e:
        logger.error(f"Error processing request: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
