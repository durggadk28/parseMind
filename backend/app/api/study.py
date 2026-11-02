import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from pydantic import BaseModel, Field

from backend.app.schemas.study_material import StudyMaterialResponse
from backend.app.services.ai_service import ai_service
from backend.app.services.document_service import document_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/study", tags=["Study Materials"])


class TextGenerationRequest(BaseModel):
    """Payload for generating study materials directly from raw text input."""
    text: str = Field(
        ...,
        min_length=30,
        description="Raw notes, lecture transcript, or study summary text."
    )


@router.post(
    "/generate-from-text",
    response_model=StudyMaterialResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate study materials from pasted text",
    description="Transforms raw text notes into structured summaries, quizzes, flashcards, and deep-dive explanations."
)
async def generate_from_text(payload: TextGenerationRequest) -> StudyMaterialResponse:
    try:
        materials = ai_service.generate_study_materials(payload.text)
        return materials
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Error during AI material generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI generation failed: {str(e)}"
        )


@router.post(
    "/generate-from-file",
    response_model=StudyMaterialResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate study materials from an uploaded file",
    description="Upload a .pdf, .txt, or .md file to extract text and generate structured study materials."
)
async def generate_from_file(file: UploadFile = File(...)) -> StudyMaterialResponse:
    try:
        extracted_text = document_service.extract_text_from_file(file)
        materials = ai_service.generate_study_materials(extracted_text)
        return materials
    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Error processing file upload: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file and generate materials: {str(e)}"
        )

