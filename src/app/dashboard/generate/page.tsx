"use client";

import { useState, useEffect, JSX } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { ChevronLeft, Loader2 } from "lucide-react";

// 1. Fix indexing error by defining specific allowed keys
type TemplateType = "modern" | "minimal" | "professional";

export default function GeneratePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("modern");
  const [resumeData, setResumeData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/resume");
      const data = await res.json();
      // Since your API returns an array, pick the first resume
      if (data && data.length > 0) {
        setResumeData(data[0]);
      }
    }
    loadData();
  }, []);

  // 2. Map templates to their components
  const templates: Record<TemplateType, JSX.Element> = {
    modern: <ModernTemplate data={resumeData} />,
    minimal: <MinimalTemplate data={resumeData} />,
    professional: <ProfessionalTemplate data={resumeData} />,
  };

  // 3. Implement the save to history logic
  const saveToHistory = async () => {
    try {
      await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selectedTemplate }),
      });
    } catch (error) {
      console.error("Failed to track generation history:", error);
    }
  };

  if (!resumeData) return <div className="flex items-center justify-center h-screen">Loading Resume Data...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-white border-r p-6 flex flex-col">
        <a href="/dashboard" className="flex items-center gap-2 text-slate-500 mb-6 hover:text-black">
          <ChevronLeft size={16} /> Dashboard
        </a>
        <h1 className="text-xl font-bold mb-6">Choose Template</h1>

        <div className="space-y-3 mb-10">
          {(['modern', 'minimal', 'professional'] as TemplateType[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTemplate(t)}
              className={`w-full p-4 rounded-xl border-2 text-left capitalize transition-all ${selectedTemplate === t ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 hover:border-slate-200"
                }`}
            >
              {t} Style
            </button>
          ))}
        </div>

        <PDFDownloadLink
          document={templates[selectedTemplate]}
          fileName={`resume-${selectedTemplate}.pdf`}
          onClick={saveToHistory}
          className="mt-auto bg-blue-600 text-white p-4 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "Download & Save History")}
        </PDFDownloadLink>
      </div>

      {/* Live Preview Pane */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-2xl shadow-inner border overflow-hidden">
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            {templates[selectedTemplate]}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}