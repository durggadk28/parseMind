import io
import os
from typing import Optional
from fastapi import UploadFile, HTTPException
from pypdf import PdfReader


class DocumentService:
    """
    Handles parsing, cleaning, and extracting text from uploaded study documents.
    """

    MIN_TEXT_LENGTH = 30  # Minimum characters needed to generate meaningful study materials

    @staticmethod
    def extract_text_from_file(file: UploadFile) -> str:
        """
        Extracts clean text from uploaded files (.pdf, .txt, .md) in-memory.
        """
        filename = file.filename or ""
        ext = os.path.splitext(filename)[1].lower()

        try:
            content_bytes = file.file.read()
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to read uploaded file: {str(e)}"
            )

        if not content_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        extracted_text = ""

        if ext in [".txt", ".md"]:
            try:
                extracted_text = content_bytes.decode("utf-8")
            except UnicodeDecodeError:
                # Fallback decoding for legacy encodings
                extracted_text = content_bytes.decode("latin-1", errors="ignore")

        elif ext == ".pdf":
            try:
                pdf_reader = PdfReader(io.BytesIO(content_bytes))
                pages_text = []
                for idx, page in enumerate(pdf_reader.pages):
                    text = page.extract_text()
                    if text:
                        pages_text.append(text)
                extracted_text = "\n\n".join(pages_text)
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unable to parse PDF content: {str(e)}"
                )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Please upload a .pdf, .txt, or .md file."
            )

        cleaned = extracted_text.strip()
        if len(cleaned) < DocumentService.MIN_TEXT_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Extracted content is too short ({len(cleaned)} chars). Please provide richer study notes."
            )

        return cleaned


document_service = DocumentService()

