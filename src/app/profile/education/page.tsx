"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { ArrowLeft, GraduationCap, Calendar, Trash2, Edit3, Plus, Save } from "lucide-react";
import Link from "next/link";

export default function EducationForm() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    degree: "",
    university: "",
    startYear: "",
    endYear: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiGet("/api/education");
      setData(res);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (form.id) {
        await apiPut("/api/education", form);
      } else {
        // Create without sending the empty ID string
        const { id, ...createData } = form;
        await apiPost("/api/education", createData);
      }
      
      setForm({ id: "", degree: "", university: "", startYear: "", endYear: "" });
      fetchData();
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: any) {
    setForm(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this education record?")) return;
    try {
      await apiDelete("/api/education", id);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition">
            <ArrowLeft size={18} /> <span>Back to Profile</span>
          </Link>
          <h1 className="text-lg font-bold text-slate-800">Education</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Plus size={20} />
              <h2 className="font-bold">{form.id ? "Edit Education" : "Add Education"}</h2>
            </div>

            <div className="space-y-4">
              <InputField label="Degree / Program" value={form.degree} onChange={(v: string) => setForm({...form, degree: v})} placeholder="Bachelor of Computer Science" />
              <InputField label="University / School" value={form.university} onChange={(v: string) => setForm({...form, university: v})} placeholder="Stanford University" />
              
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Start Date" value={form.startYear} onChange={(v: string) => setForm({...form, startYear: v})} placeholder="Jan 2020" />
                <InputField label="End Date" value={form.endYear} onChange={(v: string) => setForm({...form, endYear: v})} placeholder="Dec 2024" />
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Saving..." : <><Save size={18}/> {form.id ? "Update" : "Add Record"}</>}
              </button>
              
              {form.id && (
                <button type="button" onClick={() => setForm({id: "", degree: "", university: "", startYear: "", endYear: ""})} className="w-full text-slate-500 text-sm font-medium py-2">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <GraduationCap size={22} className="text-blue-600" /> Education History
          </h2>

          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                No education records found.
              </div>
            ) : (
              data.map((edu) => (
                <div key={edu.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{edu.degree}</h3>
                      <p className="text-slate-600 font-medium">{edu.university}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                        <Calendar size={14} />
                        <span>{edu.startYear} — {edu.endYear}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(edu)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(edu.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
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