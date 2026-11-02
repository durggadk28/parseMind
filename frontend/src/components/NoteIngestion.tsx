import React, { useState, useRef } from "react";
import { FileText, UploadCloud, Sparkles, Loader2, File, X, BookOpen, AlertCircle } from "lucide-react";
import { generateFromText, generateFromFile } from "../services/api";
import type { StudyMaterialResponse } from "../types/study";

interface NoteIngestionProps {
  onMaterialsGenerated: (data: StudyMaterialResponse) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SAMPLE_NOTES = `Cellular Respiration and Energy Production:
Cellular respiration is the biochemical process through which cells break down glucose and convert it into adenosine triphosphate (ATP), the universal cellular energy currency. 
The process occurs in three main stages:
1. Glycolysis: Takes place in the cytoplasm. One 6-carbon glucose molecule is broken down into two 3-carbon pyruvate molecules, producing a net gain of 2 ATP and 2 NADH without requiring oxygen.
2. The Krebs Cycle (Citric Acid Cycle): Occurs in the mitochondrial matrix. Pyruvate is oxidized into Acetyl-CoA and processed through the cycle, yielding 2 ATP, 6 NADH, and 2 FADH2, releasing carbon dioxide as a byproduct.
3. Oxidative Phosphorylation & The Electron Transport Chain (ETC): Located on the inner mitochondrial membrane. Electrons from NADH and FADH2 pass through protein complexes, pumping protons across the membrane to create an electrochemical gradient. ATP Synthase harnesses this proton-motive force through chemiosmosis to generate approximately 26-28 ATP molecules. Oxygen acts as the final electron acceptor, forming water.`;

export const NoteIngestion: React.FC<NoteIngestionProps> = ({
  onMaterialsGenerated,
  isLoading,
  setIsLoading,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("Analyzing your material...");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim().length < 30) {
      setErrorMessage("Please enter at least 30 characters of study notes to generate quality materials.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setLoadingStep("Extracting key concepts & summaries...");

    try {
      const data = await generateFromText(textInput);
      onMaterialsGenerated(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate study materials. Please check your backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a .pdf, .txt, or .md file to upload.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setLoadingStep("Reading document & extracting text...");

    try {
      const data = await generateFromFile(selectedFile);
      onMaterialsGenerated(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process document. Please check your backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const loadSample = () => {
    setTextInput(SAMPLE_NOTES);
    setActiveTab("text");
    setErrorMessage(null);
  };

  return (
    <section className="w-full max-w-3xl mx-auto my-8 px-4">
      {/* Hero Intro */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Study Sessions</span>
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Upload class notes or paste lecture transcripts. Our AI generates an executive summary, active-recall flashcards, practice quizzes, and ELI5 deep dives.
        </p>
      </div>

      {/* Main Ingestion Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "text"
                  ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("file")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "file"
                  ? "bg-brand-600/20 text-brand-300 border border-brand-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>

          <button
            type="button"
            onClick={loadSample}
            className="flex items-center space-x-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Try</span> Sample Notes
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 1: Textarea Form */}
        {activeTab === "text" && (
          <form onSubmit={handleTextSubmit}>
            <div className="relative">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your raw lecture notes, study summaries, or textbook excerpts here (minimum 30 characters)..."
                disabled={isLoading}
                rows={7}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-y"
              />
              <div className="flex justify-between items-center mt-2 px-1 text-xs text-slate-500">
                <span>{textInput.length} characters</span>
                {textInput.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTextInput("")}
                    className="hover:text-slate-300 transition-colors"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || textInput.trim().length < 30}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate with ParseMind</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: File Upload Form */}
        {activeTab === "file" && (
          <form onSubmit={handleFileSubmit}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.txt,.md"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors group bg-slate-950/30"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 group-hover:bg-brand-500/20 flex items-center justify-center text-slate-400 group-hover:text-brand-300 transition-all mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Click to select or drag and drop your study notes
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF documents, TXT, and Markdown files
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Process & Generate Materials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

