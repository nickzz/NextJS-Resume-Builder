"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas"; //
import jsPDF from "jspdf"; //
import { Download, ArrowLeft, Loader2 } from "lucide-react"; //
import { apiGet } from "@/lib/api";

export default function PreviewPage() {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await apiGet("/api/resume");
        if (res && res.length > 0) setResume(res[0]);
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element || !resume) return;
    try {
      setLoadingPdf(true);
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err) {
      alert("PDF generation failed.");
    } finally {
      setLoadingPdf(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Sticky Header for Preview Actions */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => window.location.href = "/dashboard"}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <button
            onClick={handleDownload}
            disabled={loadingPdf}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg shadow-blue-200 transition disabled:opacity-50"
          >
            {loadingPdf ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {loadingPdf ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </nav>

      {/* Printable Area */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div 
          ref={pdfRef} 
          className="bg-white shadow-2xl mx-auto p-12 text-slate-900 min-h-[1123px]"
          style={{ width: "210mm" }} // Standard A4 Width
        >
          {/* Reuse your existing Resume Render logic here */}
          <h1 className="text-4xl font-bold border-b-2 border-slate-900 pb-4 mb-6">{resume?.fullName}</h1>
          <p className="text-lg text-slate-600 mb-8">{resume?.position}</p>
          {/* ... Add the rest of your resume sections (Experience, Education, etc.) ... */}
        </div>
      </div>
    </div>
  );
}