import React, { useState } from "react";
import confetti from "canvas-confetti";
import type { QuizItem } from "../types/study";
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from "lucide-react";

interface QuizViewProps {
  quizzes: QuizItem[];
}

export const QuizView: React.FC<QuizViewProps> = ({ quizzes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
        No quiz questions generated for this material.
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  const optionLabels = ["A", "B", "C", "D"];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuiz.correct_index;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      // Trigger celebratory confetti for completing the quiz
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback if canvas-confetti is not loaded
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / quizzes.length) * 100);
    return (
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center max-w-xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-4 border border-brand-500/30">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
        <p className="text-slate-400 text-sm mt-1">Here is your comprehension score:</p>

        <div className="my-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 inline-block px-8">
          <span className="text-4xl font-extrabold text-brand-400">{score}</span>
          <span className="text-slate-500 text-2xl font-medium"> / {quizzes.length}</span>
          <p className="text-xs font-semibold text-emerald-400 mt-1">{percentage}% Accuracy</p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-400 px-1">
        <span className="flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-brand-400" />
          <span>Question {currentIndex + 1} of {quizzes.length}</span>
        </span>
        <span>Score: {score}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
          {currentQuiz.question}
        </h3>

        {/* 4 Choices */}
        <div className="space-y-3">
          {currentQuiz.options.map((option, idx) => {
            let buttonStyles = "border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900";
            let badgeStyles = "bg-slate-800 text-slate-400";

            if (isAnswered) {
              if (idx === currentQuiz.correct_index) {
                buttonStyles = "border-emerald-500/60 bg-emerald-500/10 text-emerald-200";
                badgeStyles = "bg-emerald-500/20 text-emerald-300";
              } else if (idx === selectedOption) {
                buttonStyles = "border-red-500/60 bg-red-500/10 text-red-200";
                badgeStyles = "bg-red-500/20 text-red-300";
              } else {
                buttonStyles = "border-slate-800/50 bg-slate-950/30 text-slate-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border text-left flex items-start space-x-3.5 transition-all text-sm font-medium ${buttonStyles}`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${badgeStyles}`}>
                  {optionLabels[idx]}
                </span>
                <span className="flex-1">{option}</span>
                {isAnswered && idx === currentQuiz.correct_index && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQuiz.correct_index && (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Pedagogical Explanation Box */}
        {isAnswered && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-sm space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 font-semibold text-xs text-brand-300">
              <span>Explanation</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {currentQuiz.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        {isAnswered && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all flex items-center space-x-2 shadow-lg shadow-brand-500/20"
            >
              <span>{currentIndex + 1 === quizzes.length ? "View Score" : "Next Question"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

