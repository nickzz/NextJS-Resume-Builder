// src/components/ThemeSelector.tsx
"use client";

import { Check } from "lucide-react";

const THEMES = [
  { id: "even", name: "Even (Professional)", color: "bg-slate-800" },
];

export default function ThemeSelector({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
            selected === theme.id ? "border-blue-600 bg-blue-50/50" : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className={`w-full h-24 rounded-lg mb-3 ${theme.color} opacity-20 flex items-center justify-center`}>
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">Preview</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700">{theme.name}</span>
            {selected === theme.id && (
              <div className="bg-blue-600 text-white rounded-full p-1">
                <Check size={14} />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}