import React from "react";
import type { SummarySubsection } from "../types/study";
import { BookOpen, CheckCircle2, Bookmark } from "lucide-react";

interface SummaryViewProps {
  summary: SummarySubsection;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  return (
    <div className="space-y-6">
      {/* 1. Executive Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-950/70 via-slate-900 to-indigo-950/60 border border-brand-500/30 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex items-center space-x-2.5 text-brand-400 font-semibold text-sm mb-3">
          <BookOpen className="w-4 h-4" />
          <span>Executive Summary</span>
        </div>
        <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
          {summary.executive_summary}
        </p>
      </div>

      {/* 2. Key Takeaways */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>Key Takeaways</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {summary.key_takeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-3 hover:border-slate-700 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-slate-200 leading-normal">{takeaway}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Topic Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm px-1">
          <Bookmark className="w-4 h-4" />
          <span>Core Topic Breakdown ({summary.topic_breakdown.length} Topics)</span>
        </div>

        <div className="grid gap-4">
          {summary.topic_breakdown.map((topic, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/30 transition-all shadow-md group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Topic {idx + 1}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  {topic.title}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-1">
                {topic.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
