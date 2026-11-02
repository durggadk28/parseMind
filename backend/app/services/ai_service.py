import json
import logging
from typing import Optional

from google import genai
from google.genai import types
from openai import OpenAI

from backend.app.core.config import settings
from backend.app.schemas.study_material import (
    StudyMaterialResponse,
    SummarySubsection,
    TopicBreakdownItem,
    QuizItem,
    FlashcardItem,
    SimplifiedConceptItem,
    GlossaryItem,
    ExplanationsSubsection,
)

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an elite academic tutor and instructional designer. 
Your objective is to transform raw study notes, lecture transcripts, or textbook excerpts into structured, high-yield learning materials.

Follow these strict pedagogical guidelines:
1. Executive Summary:
   - Provide a concise 2-3 sentence high-level overview.
   - Highlight the core significance of the subject.

2. Key Takeaways:
   - Distill the most essential concepts into clear, actionable bullet points.

3. Topic Breakdown:
   - Identify the primary thematic sections covered in the notes.
   - Provide an insightful, thorough explanation for each topic.

4. Quizzes:
   - Generate challenging multiple-choice questions testing comprehension, not just surface-level recall.
   - Provide exactly 4 plausible options for each question.
   - Specify the 0-based index of the correct answer (0, 1, 2, or 3).
   - Provide an educational explanation detailing why the correct choice is right and why other options are incorrect.

5. Flashcards:
   - Design active-recall flashcards.
   - Front: A targeted question, prompt, or term.
   - Back: A clear, memorable definition or answer.
   - Category: A clean tag matching the relevant topic.

6. Explanations & Deep Dives:
   - Simplified Concepts (ELI5): Identify complex or dense technical ideas. Explain them in simple, jargon-free language followed by an intuitive, real-world analogy.
   - Glossary: Extract technical keywords and supply authoritative, precise definitions.

Adhere strictly to the requested schema. Do not omit any required fields.
"""


class AIService:
    """
    Orchestration service for generating structured study materials
    using strict schema-enforced LLM APIs (Gemini or OpenAI).
    Includes smart dev-mode fallback when no API key is yet configured.
    """

    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()

    def generate_study_materials(self, notes_content: str) -> StudyMaterialResponse:
        """
        Takes raw study text and produces a validated StudyMaterialResponse
        guaranteed to adhere to our 4-subsection schema.
        """
        if not notes_content or not notes_content.strip():
            raise ValueError("Study notes content cannot be empty.")

        # Check if the user has configured an API key
        has_gemini = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip())
        has_openai = bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip())

        if self.provider == "gemini" and has_gemini:
            return self._generate_with_gemini(notes_content)
        elif self.provider == "openai" and has_openai:
            return self._generate_with_openai(notes_content)
        else:
            # If no API key is configured yet, provide a high-yield synthesized preview
            # so the full UI and mechanics can be tested immediately!
            logger.info("No API key configured in .env. Returning synthesized study materials.")
            return self._generate_demo_materials(notes_content)

    def _generate_with_gemini(self, notes_content: str) -> StudyMaterialResponse:
        """
        Uses Google Gemini Structured Outputs with native schema enforcement.
        """
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        prompt = f"Please process the following study notes and generate complete study materials:\n\n{notes_content}"

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=[SYSTEM_PROMPT, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=StudyMaterialResponse,
                temperature=0.2,
            ),
        )

        if hasattr(response, "parsed") and response.parsed is not None:
            if isinstance(response.parsed, StudyMaterialResponse):
                return response.parsed
            if isinstance(response.parsed, dict):
                return StudyMaterialResponse.model_validate(response.parsed)

        if response.text:
            return StudyMaterialResponse.model_validate_json(response.text)

        raise RuntimeError("Gemini returned an empty response.")

    def _generate_with_openai(self, notes_content: str) -> StudyMaterialResponse:
        """
        Uses OpenAI Structured Outputs with client.beta.chat.completions.parse.
        """
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        completion = client.beta.chat.completions.parse(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Please process the following study notes:\n\n{notes_content}"},
            ],
            response_format=StudyMaterialResponse,
            temperature=0.2,
        )

        result = completion.choices[0].message.parsed
        if result is None:
            raise RuntimeError("OpenAI failed to return structured study material.")
        return result

    def _generate_demo_materials(self, notes_content: str) -> StudyMaterialResponse:
        """
        Generates realistic, schema-valid study materials so the user can test
        and interact with the entire frontend pipeline before adding an API key.
        """
        is_biology = "cellular" in notes_content.lower() or "respiration" in notes_content.lower() or "glucose" in notes_content.lower()

        if is_biology:
            return StudyMaterialResponse(
                summary=SummarySubsection(
                    executive_summary="Cellular respiration is the fundamental biochemical mechanism by which eukaryotic cells convert biochemical energy from glucose into ATP. The pathway spans glycolysis, the citric acid cycle, and oxidative phosphorylation, ultimately harnessing electron transfer to drive mechanical ATP synthase rotation. Understanding this pathway explains how organisms sustain metabolic life and process nutrients into usable molecular fuel.",
                    key_takeaways=[
                        "Glycolysis yields a net gain of 2 ATP and 2 NADH in the cytoplasm without oxygen.",
                        "The Krebs Cycle oxidizes acetyl-CoA in the mitochondrial matrix, producing electron carriers (NADH, FADH2).",
                        "The Electron Transport Chain creates a proton gradient across the inner mitochondrial membrane.",
                        "ATP Synthase produces ~26-28 ATP via chemiosmosis using proton-motive force.",
                        "Oxygen acts as the terminal electron acceptor, preventing system gridlock and creating water."
                    ],
                    topic_breakdown=[
                        TopicBreakdownItem(
                            title="Glycolysis & Anaerobic Energy",
                            summary="Occurs in the cytosol where a 6-carbon glucose is enzymatically cleaved into two 3-carbon pyruvate molecules. An investment of 2 ATP yields 4 ATP (net 2) and reduces NAD+ to NADH."
                        ),
                        TopicBreakdownItem(
                            title="The Krebs (Citric Acid) Cycle",
                            summary="Takes place within the mitochondrial matrix. Pyruvate is decarboxylated into Acetyl-CoA, which enters an 8-step cycle that strips high-energy electrons to charge NADH and FADH2."
                        ),
                        TopicBreakdownItem(
                            title="Oxidative Phosphorylation & Chemiosmosis",
                            summary="The grand finale where complexes I through IV pump hydrogen ions into the intermembrane space. The resulting voltage gradient drives ATP synthase like a microscopic turbine."
                        )
                    ]
                ),
                quizzes=[
                    QuizItem(
                        question_id=1,
                        question="Where in the eukaryotic cell does glycolysis specifically take place?",
                        options=[
                            "Mitochondrial matrix",
                            "Cytoplasm / Cytosol",
                            "Inner mitochondrial membrane",
                            "Endoplasmic reticulum"
                        ],
                        correct_index=1,
                        explanation="Glycolysis is an ancient metabolic pathway that takes place entirely within the cytoplasm (cytosol) of the cell and does not require oxygen or membrane-bound organelles."
                    ),
                    QuizItem(
                        question_id=2,
                        question="What is the net yield of ATP produced per glucose molecule during glycolysis alone?",
                        options=[
                            "4 ATP",
                            "2 ATP",
                            "32 ATP",
                            "0 ATP"
                        ],
                        correct_index=1,
                        explanation="Although glycolysis produces 4 ATP molecules in total during its payoff phase, it consumes 2 ATP during the preparatory phase, resulting in a net yield of 2 ATP."
                    ),
                    QuizItem(
                        question_id=3,
                        question="What is the critical role of Oxygen (O2) in aerobic cellular respiration?",
                        options=[
                            "It breaks down glucose directly in the cytoplasm",
                            "It serves as the terminal electron acceptor in the Electron Transport Chain",
                            "It acts as an enzyme inside the Krebs Cycle",
                            "It pumps protons into the mitochondrial matrix"
                        ],
                        correct_index=1,
                        explanation="Oxygen has very high electronegativity and pulls electrons through the ETC. As the terminal electron acceptor, it binds with free protons to form harmless water (H2O), preventing electron traffic jams."
                    ),
                    QuizItem(
                        question_id=4,
                        question="How does ATP Synthase physically synthesize ATP from ADP and inorganic phosphate?",
                        options=[
                            "By hydrolyzing glucose molecules directly",
                            "By utilizing the flow of protons down their electrochemical gradient (chemiosmosis)",
                            "Through direct ultraviolet light activation",
                            "By absorbing CO2 gas produced in glycolysis"
                        ],
                        correct_index=1,
                        explanation="ATP Synthase functions as a rotary molecular motor. Protons stored in high concentration in the intermembrane space flow through the enzyme back into the matrix, rotating its catalytic rotor to bind ADP and Pi into ATP."
                    )
                ],
                flashcards=[
                    FlashcardItem(
                        card_id=1,
                        front="What is Chemiosmosis?",
                        back="The movement of ions (protons) across a semipermeable membrane down their electrochemical gradient to generate mechanical energy that powers ATP synthesis.",
                        category="Bioenergetics"
                    ),
                    FlashcardItem(
                        card_id=2,
                        front="What molecules act as primary electron shuttles to the ETC?",
                        back="NADH and FADH2. They carry high-energy electrons extracted from glucose breakdown directly to protein complexes I and II in the inner mitochondrial membrane.",
                        category="Metabolism"
                    ),
                    FlashcardItem(
                        card_id=3,
                        front="What is the primary waste product of the Krebs Cycle?",
                        back="Carbon Dioxide (CO2), which is released when carbon atoms are stripped off pyruvate and citric acid intermediates.",
                        category="Biochemistry"
                    ),
                    FlashcardItem(
                        card_id=4,
                        front="Why is the inner mitochondrial membrane extensively folded into cristae?",
                        back="The folds vastly increase surface area, packing millions of electron transport chains and ATP synthase complexes into each mitochondrion.",
                        category="Cell Anatomy"
                    )
                ],
                explanations=ExplanationsSubsection(
                    simplified_concepts=[
                        SimplifiedConceptItem(
                            concept="The Electron Transport Chain (ETC)",
                            eli5="Imagine a bucket brigade of firefighters passing water, except they are passing hot electrons. As each person passes the bucket, they step on a pedal that pumps water uphill behind a dam. When the dam opens, that rushing water turns a waterwheel to generate electricity.",
                            example="A hydroelectric dam: the ETC pumps the water up into the reservoir, and ATP Synthase is the turbine generating power as water rushes down."
                        ),
                        SimplifiedConceptItem(
                            concept="ATP (Adenosine Triphosphate)",
                            eli5="ATP is like a rechargeable battery for your cells. It has three phosphate springs squeezed together. When you snap the third spring off, it releases energy to do work, leaving a depleted battery called ADP.",
                            example="A compressed jack-in-the-box spring that releases energy when triggered."
                        )
                    ],
                    glossary=[
                        GlossaryItem(
                            term="Chemiosmosis",
                            definition="The diffusion of ions across a selectively permeable membrane, specifically referring to the generation of ATP by the movement of hydrogen ions through ATP synthase."
                        ),
                        GlossaryItem(
                            term="Substrate-Level Phosphorylation",
                            definition="A direct synthesis of ATP by transferring a phosphate group directly from a phosphorylated metabolic intermediate to ADP, as seen in glycolysis and the Krebs cycle."
                        ),
                        GlossaryItem(
                            term="Proton-Motive Force",
                            definition="The electrochemical gradient of protons generated across the inner mitochondrial membrane by the electron transport chain, storing potential energy."
                        ),
                        GlossaryItem(
                            term="Acetyl-CoA",
                            definition="A 2-carbon molecule derived from pyruvate breakdown that delivers an acetyl group to oxaloacetate to ignite the Krebs cycle."
                        )
                    ]
                )
            )
        else:
            # General fallback for any custom notes
            return StudyMaterialResponse(
                summary=SummarySubsection(
                    executive_summary=f"Analysis of provided study notes: {notes_content[:120].strip()}... The material establishes essential foundational concepts and explores key mechanisms within the domain. Mastering these concepts facilitates advanced comprehension and contextual application.",
                    key_takeaways=[
                        "Core principles rely on structured sequential relationships.",
                        "Key terminology dictates contextual problem solving.",
                        "Interconnected frameworks drive predictive analytical models.",
                        "Consistent review of foundational definitions accelerates domain mastery."
                    ],
                    topic_breakdown=[
                        TopicBreakdownItem(
                            title="Foundational Principles",
                            summary="An examination of core laws and baseline axioms that govern the subject matter."
                        ),
                        TopicBreakdownItem(
                            title="Mechanisms & Applications",
                            summary="Detailed workflow tracing how theoretical models manifest in real-world scenarios."
                        )
                    ]
                ),
                quizzes=[
                    QuizItem(
                        question_id=1,
                        question="Based on the study notes, what is the primary objective of this subject?",
                        options=[
                            "To establish core systemic understanding",
                            "To invalidate prior foundational models",
                            "To minimize empirical observations",
                            "To isolate unrelated variables"
                        ],
                        correct_index=0,
                        explanation="The notes systematically structure core principles to establish an integrated understanding of the overarching subject matter."
                    ),
                    QuizItem(
                        question_id=2,
                        question="Which approach best reinforces long-term retention of these concepts?",
                        options=[
                            "Passive re-reading of source material",
                            "Active recall and spaced retrieval practice",
                            "Memorizing isolated definitions without context",
                            "Skipping foundational principles"
                        ],
                        correct_index=1,
                        explanation="Cognitive science proves that active recall (such as flashcards and practice quizzes) yields significantly higher comprehension and retention than passive review."
                    )
                ],
                flashcards=[
                    FlashcardItem(
                        card_id=1,
                        front="What is the core takeaway of this lesson?",
                        back="Consistent application of systematic frameworks leads to predictable, high-yield results.",
                        category="Core Concept"
                    ),
                    FlashcardItem(
                        card_id=2,
                        front="How should key terminology be approached?",
                        back="Learn the precise definition first, then contextualize it with an intuitive real-world analogy.",
                        category="Methodology"
                    )
                ],
                explanations=ExplanationsSubsection(
                    simplified_concepts=[
                        SimplifiedConceptItem(
                            concept="Systematic Decomposition",
                            eli5="Taking a big, scary puzzle and sorting all the edge pieces first so the whole picture becomes simple to build.",
                            example="Building a LEGO set one numbered bag at a time instead of dumping all 1,000 bricks into a pile."
                        )
                    ],
                    glossary=[
                        GlossaryItem(
                            term="Heuristic",
                            definition="A practical, rule-of-thumb approach to problem-solving that is efficient and effective for immediate goals."
                        ),
                        GlossaryItem(
                            term="Synthesis",
                            definition="The combination of ideas, data, or components into a complex, coherent whole."
                        )
                    ]
                )
            )


# Singleton instance
ai_service = AIService()
