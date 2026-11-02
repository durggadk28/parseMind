import React, { useState } from "react";
import type { FlashcardItem } from "../types/study";
import { ChevronLeft, ChevronRight, RotateCw, Check, Tag } from "lucide-react";

interface FlashcardViewProps {
  flashcards: FlashcardItem[];
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
        No flashcards generated for this material.
      </div>
    );
  }

  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(flashcards.map((f) => f.category)))];

  const filteredCards = selectedCategory === "all"
    ? flashcards
    : flashcards.filter((f) => f.category === selectedCategory);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const toggleMastered = (e: React.MouseEvent, cardId: number) => {
    e.stopPropagation();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <Tag className="w-4 h-4 text-slate-500 flex-shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Progress & Mastery Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Card {currentIndex + 1} of {filteredCards.length}
        </span>
        <span className="text-emerald-400 font-medium">
          {masteredIds.size} of {flashcards.length} Mastered
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="w-full h-80 perspective-1000 cursor-pointer select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform rounded-2xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between hover:border-brand-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {activeCard.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <RotateCw className="w-3 h-3" /> Click to flip
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {activeCard.front}
              </p>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Front (Prompt)</span>
              {masteredIds.has(activeCard.card_id) && (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Mastered
                </span>
              )}
            </div>
          </div>

          {/* Back of Card (Rotated 180deg) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-8 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Answer / Definition
              </span>
              <button
                type="button"
                onClick={(e) => toggleMastered(e, activeCard.card_id)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                  masteredIds.has(activeCard.card_id)
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600"
                }`}
              >
                <Check className="w-3 h-3" />
                <span>{masteredIds.has(activeCard.card_id) ? "Mastered" : "Mark Mastered"}</span>
              </button>
            </div>

            <div className="my-auto px-4 overflow-y-auto max-h-44 text-center">
              <p className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed">
                {activeCard.back}
              </p>
            </div>

            <div className="text-right text-xs text-slate-500">
              Click anywhere to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-4 pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={filteredCards.length <= 1}
          className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
          title="Previous card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-2"
        >
          <RotateCw className="w-4 h-4" />
          <span>Flip Card</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={filteredCards.length <= 1}
          className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
          title="Next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

