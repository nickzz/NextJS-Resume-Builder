"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { apiGet } from "@/lib/api";

export default function DashboardPage() {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await apiGet("/api/resume");
        console.log("🟢 Resume API Response:", res); // <--- Add this
        if (res && res.length > 0) {
          setResume(res[0]);
        } else {
          setResume(null); // Explicitly set null for empty result
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false); // ✅ Always stop loading
      }
    }
    fetchResume();
  }, []);

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element || !resume) return;
    try {
      setLoadingPdf(true);
      await document.fonts.ready;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      } else {
        const pageHeightPx =
          (canvas.width * pdf.internal.pageSize.getHeight()) / pdfWidth;
        let remainingHeight = canvas.height;
        let y = 0;
        while (remainingHeight > 0) {
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pageHeightPx, remainingHeight);

          const ctx = pageCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              y,
              canvas.width,
              pageCanvas.height,
              0,
              0,
              canvas.width,
              pageCanvas.height
            );
            const pageData = pageCanvas.toDataURL("image/png");
            if (y > 0) pdf.addPage();
            pdf.addImage(
              pageData,
              "PNG",
              0,
              0,
              pdfWidth,
              pdf.internal.pageSize.getHeight()
            );
          }

          remainingHeight -= pageCanvas.height;
          y += pageCanvas.height;
        }
      }

      const fileName = `${(resume.fullName || "resume").replace(
        /\s+/g,
        "_"
      )}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setLoadingPdf(false);
    }
  };

  // 🟡 Case 1: Still loading
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading resume data…
      </div>
    );

  // 🔴 Case 2: No resume found
  if (!resume)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 space-y-4">
        <p>No resume found.</p>
        <a
          href="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create New Resume
        </a>
      </div>
    );

  // 🟢 Case 3: Resume loaded successfully
  const skillsList = (resume.skills || [])
    .map((s: any) => s.skillName)
    .filter(Boolean)
    .join(", ");

  console.log("🟢 Resume API:", skillsList); // <--- Add this

  return (
    <main className="min-h-screen bg-gray-100 p-6 sm:p-8 lg:p-6">
      {/* ===== TOP BAR ===== */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-blue-600 rounded-sm"></span>
          Resume Preview
        </h1>

        <div className="flex gap-3">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            Admin
          </a>
          <button
            onClick={handleDownload}
            disabled={loadingPdf}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
          >
            <Download size={16} />
            {loadingPdf ? "Preparing PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* ===== PRINTABLE RESUME ===== */}
      <div
        ref={pdfRef}
        className="mx-auto bg-white max-w-3xl shadow-lg p-6 sm:p-10 text-gray-900 print-a4"
        style={{ boxSizing: "border-box" }}
      >
        {/* ===== HEADER ===== */}
        <header className="text-center sm:text-left mb-6 border-b border-gray-200 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-6">
            {resume.profileImage && (
              <img
                src={resume.profileImage}
                alt={resume.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-600 mx-auto sm:mx-0"
                style={{ objectPosition: "50% 25%" }}
              />
            )}

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900">
                {resume.fullName}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {resume.position}
              </p>

              <div className="mt-3 text-xs sm:text-sm text-gray-700 space-y-1">
                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span>{resume.address}</span>
                  {resume.address && <span className="hidden sm:inline">|</span>}
                  <span>{resume.phone}</span>
                  {resume.phone && resume.email && (
                    <span className="hidden sm:inline">|</span>
                  )}
                  {resume.email}
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                  {resume.linkedin && (
                    <a
                      href={resume.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      LinkedIn
                    </a>
                  )}
                  {resume.github && (
                    <a
                      href={resume.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===== SUMMARY ===== */}
        {resume.careerSummary && (
          <section className="mb-5">
            <h3 className="section-title">PROFESSIONAL SUMMARY</h3>
            <p className="text-sm leading-relaxed">
              {resume.careerSummary}
            </p>
          </section>
        )}

        {/* ===== EXPERIENCE ===== */}
        {resume.experiences?.length > 0 && (
          <section className="mb-5">
            <h3 className="section-title">PROFESSIONAL EXPERIENCE</h3>
            <div className="space-y-4">
              {resume.experiences.map((exp: any) => (
                <article key={exp.id}>
                  <h4 className="font-semibold text-gray-800">{exp.title}</h4>
                  <div className="text-sm text-gray-600 mb-1">{exp.company}</div>
                  <div className="text-sm text-gray-500 mb-1">
                    {exp.startDate} – {exp.endDate}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ===== EDUCATION ===== */}
        {resume.educations?.length > 0 && (
          <section className="mb-5">
            <h3 className="section-title">EDUCATION</h3>
            <div className="space-y-3">
              {resume.educations.map((edu: any) => (
                <div key={edu.id}>
                  <div className="font-semibold text-gray-800">{edu.degree}</div>
                  <div className="text-sm text-gray-600">
                    {edu.university} ({edu.startYear} - {edu.endYear})
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== SKILLS ===== */}
        {skillsList && (
          <section className="mb-5">
            <h3 className="section-title">TECHNICAL SKILLS</h3>
            <p className="text-sm text-gray-700">{skillsList}</p>
          </section>
        )}

        {/* ===== CERTIFICATES ===== */}
        {resume.certificates?.length > 0 && (
          <section className="mb-5">
            <h3 className="section-title">CERTIFICATES</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {resume.certificates.map((c: any) => (
                <li key={c.id}>
                  {c.certName} — {c.issuedBy} ({c.year})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ===== LANGUAGES ===== */}
        {resume.languages?.length > 0 && (
          <section className="mb-5">
            <h3 className="section-title">LANGUAGES</h3>
            <p className="text-sm text-gray-700">
              {resume.languages
                .map((l: any) => `${l.language} — ${l.proficiency}`)
                .join(", ")}
            </p>
          </section>
        )}

        {/* ===== REFERENCES ===== */}
        {resume.references?.length > 0 && (
          <section className="mb-2">
            <h3 className="section-title">REFERENCE</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {resume.references.map((r: any) => (
                <li key={r.id}>
                  {r.refName} — {r.company} ({r.contact})
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
