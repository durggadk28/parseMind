import React, { useEffect, useState } from "react";
import { Sparkles, Brain, AlertCircle } from "lucide-react";
import { checkBackendHealth } from "../services/api";

export const Header: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [provider, setProvider] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth()
      .then((data) => {
        if (isMounted) {
          setBackendStatus("online");
          setProvider(data.provider);
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackendStatus("offline");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">ParseMind</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Turn raw notes into mastery materials</p>
          </div>
        </div>

        {/* Live Backend Connection Indicator */}
        <div className="flex items-center space-x-2">
          {backendStatus === "online" && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>API Ready {provider ? `(${provider.toUpperCase()})` : ""}</span>
            </div>
          )}
          {backendStatus === "offline" && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium" title="Make sure your FastAPI server is running on port 8000">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Backend Offline</span>
            </div>
          )}
          {backendStatus === "checking" && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
              <span>Connecting...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
