import React, { useState, useRef } from "react";
import { Header } from "./components/Header";
import { NoteIngestion } from "./components/NoteIngestion";
import { SummaryView } from "./components/SummaryView";
import { QuizView } from "./components/QuizView";
import { FlashcardView } from "./components/FlashcardView";
import { ExplanationsView } from "./components/ExplanationsView";
import { Component as FlipLinksHero } from "@/components/ui/flip-links";
import type { StudyMaterialResponse } from "./types/study";
import { Sparkles, BookOpen, Layers, HelpCircle, Lightbulb, RotateCcw } from "lucide-react";

type ActiveTab = "summary" | "quizzes" | "flashcards" | "explanations";

export const App: React.FC = () => {
  const [studyData, setStudyData] = useState<StudyMaterialResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("summary");
  const ingestionRef = useRef<HTMLDivElement>(null);

  const scrollToIngestion = () => {
    ingestionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setStudyData(null);
    setActiveTab("summary");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto">
        {!studyData ? (
          <div>
            {/* 21st.dev Flip Links Fullscreen Template */}
            <FlipLinksHero onStart={scrollToIngestion} />

            {/* Note Ingestion Workspace Section */}
            <div ref={ingestionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <NoteIngestion
                onMaterialsGenerated={(data) => {
                  setStudyData(data);
                  setActiveTab("summary");
                }}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header Toolbar when materials are generated */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Study Pack Generated</h2>
                  <p className="text-xs text-slate-400">
                    {studyData.quizzes.length} Quizzes • {studyData.flashcards.length} Flashcards • {studyData.explanations.glossary.length} Glossary Terms
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload New Notes</span>
              </button>
            </div>

            {/* Interactive Module Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("summary")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "summary"
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Summary & Topics</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quizzes")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "quizzes"
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quizzes</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${activeTab === "quizzes" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {studyData.quizzes.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("flashcards")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "flashcards"
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Flashcards</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${activeTab === "flashcards" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {studyData.flashcards.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("explanations")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "explanations"
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>ELI5 & Glossary</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${activeTab === "explanations" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {studyData.explanations.simplified_concepts.length + studyData.explanations.glossary.length}
                </span>
              </button>
            </div>

            {/* Active Subsection View */}
            <div className="pt-2">
              {activeTab === "summary" && <SummaryView summary={studyData.summary} />}
              {activeTab === "quizzes" && <QuizView quizzes={studyData.quizzes} />}
              {activeTab === "flashcards" && <FlashcardView flashcards={studyData.flashcards} />}
              {activeTab === "explanations" && <ExplanationsView explanations={studyData.explanations} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
