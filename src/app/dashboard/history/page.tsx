// src/app/dashboard/history/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Download, FileClock } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/resume/generate").then(res => res.json()).then(setHistory);
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FileClock /> Generation History
      </h1>
      <div className="space-y-4">
        {history.map((item: any) => (
          <div key={item.id} className="p-6 bg-white border rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Theme: {item.theme}</p>
              <p className="text-slate-500 text-sm">Generated on {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <a 
              href={`/api/resume/download?id=${item.id}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              <Download size={18} /> Download PDF
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}