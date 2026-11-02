import React, { useState } from "react";
import type { ExplanationsSubsection } from "../types/study";
import { Lightbulb, BookA, Search, Sparkles } from "lucide-react";

interface ExplanationsViewProps {
  explanations: ExplanationsSubsection;
}

export const ExplanationsView: React.FC<ExplanationsViewProps> = ({ explanations }) => {
  const [glossaryQuery, setGlossaryQuery] = useState("");

  const filteredGlossary = explanations.glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* 1. Simplified Concepts (ELI5) */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm px-1">
          <Lightbulb className="w-4 h-4" />
          <span>Simplified Concepts (Explain Like I'm 5)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {explanations.simplified_concepts.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.concept}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    ELI5
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {item.eli5}
                </p>
              </div>

              {/* Real World Analogy Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Real-World Analogy
                </span>
                <p className="text-slate-400 leading-normal italic">
                  "{item.example}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Technical Glossary */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
            <BookA className="w-4 h-4" />
            <span>Technical Glossary ({explanations.glossary.length} Terms)</span>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={glossaryQuery}
              onChange={(e) => setGlossaryQuery(e.target.value)}
              placeholder="Search terms or definitions..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        {filteredGlossary.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
            No terms matching "{glossaryQuery}".
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <h4 className="text-sm font-bold text-brand-300 mb-1.5">
                  {item.term}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

