from typing import List
from pydantic import BaseModel, Field


# ==========================================
# 1. Summary Subsection Schemas
# ==========================================
class TopicBreakdownItem(BaseModel):
    title: str = Field(..., description="Title of the topic covered in the notes.")
    summary: str = Field(..., description="Detailed explanation and summary of this topic.")


class SummarySubsection(BaseModel):
    executive_summary: str = Field(
        ...,
        description="High-level 2-3 sentence overview of the uploaded study material."
    )
    key_takeaways: List[str] = Field(
        ...,
        description="Array of the most critical bullet points to remember."
    )
    topic_breakdown: List[TopicBreakdownItem] = Field(
        ...,
        description="Array of key topics covered, each with a title and detailed summary."
    )


# ==========================================
# 2. Quizzes Subsection Schemas
# ==========================================
class QuizItem(BaseModel):
    question_id: int = Field(..., description="Unique incremental identifier for the question.")
    question: str = Field(..., description="The multiple choice question prompt.")
    options: List[str] = Field(
        ...,
        min_length=4,
        max_length=4,
        description="Array of exactly 4 plausible choices."
    )
    correct_index: int = Field(
        ...,
        ge=0,
        le=3,
        description="Zero-based index of the correct option (0, 1, 2, or 3)."
    )
    explanation: str = Field(
        ...,
        description="Detailed pedagogical explanation of why the correct option is right."
    )


# ==========================================
# 3. Flashcards Subsection Schemas
# ==========================================
class FlashcardItem(BaseModel):
    card_id: int = Field(..., description="Unique incremental identifier for the flashcard.")
    front: str = Field(..., description="Prompt, question, or key term shown on the front.")
    back: str = Field(..., description="Detailed definition, formula, or answer on the back.")
    category: str = Field(..., description="Topic tag or category for organizational filtering.")


# ==========================================
# 4. Explanations & Deep Dives Subsection Schemas
# ==========================================
class SimplifiedConceptItem(BaseModel):
    concept: str = Field(..., description="The complex or technical jargon being broken down.")
    eli5: str = Field(
        ...,
        description="Explain Like I'm 5 breakdown using clear, intuitive everyday language."
    )
    example: str = Field(
        ...,
        description="Relatable real-world analogy or concrete example illustrating the concept."
    )


class GlossaryItem(BaseModel):
    term: str = Field(..., description="Key technical term or domain-specific vocabulary.")
    definition: str = Field(..., description="Precise academic or professional definition.")


class ExplanationsSubsection(BaseModel):
    simplified_concepts: List[SimplifiedConceptItem] = Field(
        ...,
        description="Difficult concepts broken down into ELI5 explanations with real-world examples."
    )
    glossary: List[GlossaryItem] = Field(
        ...,
        description="Key technical terms and their precise definitions."
    )


# ==========================================
# Master Strict AI Output Schema
# ==========================================
class StudyMaterialResponse(BaseModel):
    """
    Master contract passed directly to Gemini / OpenAI Structured Outputs.
    Guarantees that the LLM response contains every subsection and field in valid JSON.
    """
    summary: SummarySubsection
    quizzes: List[QuizItem]
    flashcards: List[FlashcardItem]
    explanations: ExplanationsSubsection

