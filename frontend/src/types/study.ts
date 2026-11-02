// ==========================================
// 1. Summary Subsection Types
// ==========================================
export interface TopicBreakdownItem {
  title: string;
  summary: string;
}

export interface SummarySubsection {
  executive_summary: string;
  key_takeaways: string[];
  topic_breakdown: TopicBreakdownItem[];
}

// ==========================================
// 2. Quizzes Subsection Types
// ==========================================
export interface QuizItem {
  question_id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

// ==========================================
// 3. Flashcards Subsection Types
// ==========================================
export interface FlashcardItem {
  card_id: number;
  front: string;
  back: string;
  category: string;
}

// ==========================================
// 4. Explanations & Deep Dives Types
// ==========================================
export interface SimplifiedConceptItem {
  concept: string;
  eli5: string;
  example: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface ExplanationsSubsection {
  simplified_concepts: SimplifiedConceptItem[];
  glossary: GlossaryItem[];
}

// ==========================================
// Master Study Material Response Type
// ==========================================
export interface StudyMaterialResponse {
  summary: SummarySubsection;
  quizzes: QuizItem[];
  flashcards: FlashcardItem[];
  explanations: ExplanationsSubsection;
}

