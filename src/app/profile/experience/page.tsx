"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { ArrowLeft, Briefcase, Calendar, Trash2, Edit3, Plus, Save } from "lucide-react";
import Link from "next/link";

const EditorComponent = dynamic(() => import("@/components/TiptapEditor"), { ssr: false });

export default function ExperienceForm() {
  const [data, setData] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "", // TipTap HTML content
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiGet("/api/experience");
      setData(res);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  }

  // Converts TipTap HTML to "item1;item2;item3" string
  const formatDescriptionForSave = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const items = Array.from(tempDiv.querySelectorAll("li")).map(li => li.innerText.trim());
    return items.length > 0 ? items.join(";") : tempDiv.innerText.replace(/\n/g, ";");
  };

  // Converts "item1;item2;item3" back to HTML <ul> for TipTap
  const formatDescriptionForEditor = (str: string) => {
    if (!str) return "";
    // Split by semicolon and wrap each item in <li> tags
    const items = str.split(";").filter(i => i.trim() !== "");
    if (items.length === 0) return `<p>${str}</p>`;
    return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. Format the description to your semicolon pattern
    const formattedDescription = formatDescriptionForSave(form.description);

    // 2. Destructure to separate ID from the rest of the data
    const { id, ...dataWithoutId } = form;

    try {
      if (id) {
        // UPDATE: Send the ID and the updated data
        await apiPut("/api/experience", { ...form, description: formattedDescription });
      } else {
        // CREATE: Send ONLY the data, NO ID field
        await apiPost("/api/experience", { ...dataWithoutId, description: formattedDescription });
      }

      // Clear form and refresh
      setForm({ id: "", title: "", company: "", startDate: "", endDate: "", description: "" });
      fetchData();
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: any) {
    setForm({
      ...item,
      description: formatDescriptionForEditor(item.description)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    // Use a modern confirmation (or just standard window.confirm)
    if (!confirm("Are you sure you want to remove this experience?")) return;

    try {
      await apiDelete("/api/experience", id);
      // Refresh the list after successful deletion
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete the record. Please try again.");
    }
  }

  async function handleAiOptimize() {
    if (!form.description || !form.title) {
      return alert("Please enter a Job Title and some description first.");
    }

    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "experience",
          content: form.description,
          position: form.title
        }),
      });

      const data = await res.json();
      console.log(data)

      if (data.suggestion) {
        // 1. Clean the suggestion (remove any markdown formatting like ** or \n)
        const cleanSuggestion = data.suggestion.replace(/\n/g, "");

        // 2. Convert the semicolon string into HTML List Items
        const items = cleanSuggestion.split(';').filter((i: string) => i.trim() !== "");
        const htmlList = `<ul>${items.map((i: string) => `<li>${i.trim()}</li>`).join('')}</ul>`;

        // 3. Update the form
        setForm({ ...form, description: htmlList });
      }
    } catch (err) {
      console.error("AI Error:", err);
      alert("AI optimization failed.");
    } finally {
      setIsAiLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition">
            <ArrowLeft size={18} /> <span>Back to Profile</span>
          </Link>
          <h1 className="text-lg font-bold text-slate-800">Work Experience</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Plus size={20} />
              <h2 className="font-bold">{form.id ? "Edit Position" : "Add New Position"}</h2>
            </div>

            <div className="space-y-4">
              <InputField label="Job Title" value={form.title} onChange={(v: any) => setForm({ ...form, title: v })} placeholder="Fullstack Developer" />
              <InputField label="Company" value={form.company} onChange={(v: any) => setForm({ ...form, company: v })} placeholder="Google" />

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Start Date" value={form.startDate} onChange={(v: any) => setForm({ ...form, startDate: v })} placeholder="Jan 2022" />
                <InputField label="End Date" value={form.endDate} onChange={(v: any) => setForm({ ...form, endDate: v })} placeholder="Present" />
              </div>

              {/* <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Key Responsibilities
                </label>
                <EditorComponent
                  key={form.id || "new"} // 👈 Forces the editor to reset when switching records
                  content={form.description}
                  onChange={(html) => setForm({ ...form, description: html })}
                />
              </div> */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Key Responsibilities
                  </label>
                  <button
                    type="button"
                    onClick={handleAiOptimize}
                    disabled={isAiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <span className="animate-pulse">Optimizing...</span>
                    ) : (
                      <>
                        <span className="text-sm">✨</span> Optimize with AI
                      </>
                    )}
                  </button>
                </div>

                <div className="prose prose-sm max-w-none rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <EditorComponent
                    key={form.id || "ai-update-" + Date.now()} // Using a dynamic key helps force re-render when AI content arrives
                    content={form.description}
                    onChange={(html) => setForm({ ...form, description: html })}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">
                  AI will focus on action verbs and impact metrics
                </p>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : <><Save size={18} /> {form.id ? "Update" : "Save Experience"}</>}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm({ id: "", title: "", company: "", startDate: "", endDate: "", description: "" })} className="w-full text-slate-500 text-sm font-medium py-2">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Briefcase size={22} className="text-blue-600" /> Professional Timeline
          </h2>

          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                No experience added yet.
              </div>
            ) : (
              data.map((exp) => (
                <div key={exp.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{exp.title}</h3>
                      <p className="text-slate-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(exp)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                    <Calendar size={14} />
                    <span>{exp.startDate} — {exp.endDate}</span>
                  </div>

                  <ul className="list-disc pl-5 space-y-1">
                    {exp.description.split(";").map((point: string, idx: number) => (
                      <li key={idx} className="text-sm text-slate-600 leading-relaxed">{point}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function InputField({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
      />
    </div>
  );
}