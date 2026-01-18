"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { ArrowLeft, Languages, Trash2, Edit3, Plus, Save, Globe } from "lucide-react";
import Link from "next/link";

export default function LanguageForm() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    language: "",
    proficiency: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiGet("/api/language");
      setData(res);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.language.trim()) return alert("Language name is required");
    if (!form.proficiency) return alert("Please select proficiency level");
    setLoading(true);

    try {
      if (form.id) {
        await apiPut("/api/language", form);
      } else {
        const { id, ...createData } = form;
        await apiPost("/api/language", createData);
      }
      
      setForm({ id: "", language: "", proficiency: "" });
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
    if (!confirm("Remove this language?")) return;
    try {
      await apiDelete("/api/language", id);
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
          <h1 className="text-lg font-bold text-slate-800">Languages</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Plus size={20} />
              <h2 className="font-bold">{form.id ? "Edit Language" : "Add Language"}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Language Name</label>
                <input
                  type="text"
                  value={form.language}
                  onChange={(e) => setForm({...form, language: e.target.value})}
                  placeholder="e.g. English, Japanese"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={form.proficiency}
                  onChange={(e) => setForm({...form, proficiency: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                >
                  <option value="">Select proficiency</option>
                  <option value="Native">Native / Bilingual</option>
                  <option value="Fluent">Fluent / Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic / Elementary</option>
                </select>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Saving..." : <><Save size={18}/> {form.id ? "Update" : "Add Record"}</>}
              </button>
              
              {form.id && (
                <button type="button" onClick={() => setForm({id: "", language: "", proficiency: ""})} className="w-full text-slate-500 text-sm font-medium py-2">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Globe size={22} className="text-blue-600" /> Language Skills
          </h2>

          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                No languages added yet.
              </div>
            ) : (
              data.map((lang) => (
                <div key={lang.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow group flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <Languages size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{lang.language}</h3>
                      <span className="text-sm font-medium text-blue-500 px-2 py-0.5 bg-blue-50 rounded-md">
                        {lang.proficiency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(lang)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(lang.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
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