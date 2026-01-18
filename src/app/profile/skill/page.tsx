"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { ArrowLeft, Code2, Trash2, Edit3, Plus, Save, X } from "lucide-react";
import Link from "next/link";

export default function SkillForm() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Local state for the "chips" before saving
  const [skillList, setSkillList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  const [form, setForm] = useState({
    id: "",
    skillType: "Technical", // Default type
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiGet("/api/skill");
      setData(res);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = inputValue.trim();
      if (value && !skillList.includes(value)) {
        setSkillList([...skillList, value]);
        setInputValue("");
      }
    }
  };

  const removeChip = (skillToRemove: string) => {
    setSkillList(skillList.filter((s) => s !== skillToRemove));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (skillList.length === 0) return alert("Please add at least one skill");
    setLoading(true);

    const payload = {
      ...form,
      skillName: skillList.join(";"), // Format: "abc;def"
    };

    try {
      if (form.id) {
        await apiPut("/api/skill", payload);
      } else {
        await apiPost("/api/skill", payload);
      }
      
      setForm({ id: "", skillType: "Technical" });
      setSkillList([]);
      fetchData();
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: any) {
    setForm({ id: item.id, skillType: item.skillType });
    setSkillList(item.skillName.split(";").filter((s: string) => s !== ""));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this skill group?")) return;
    try {
      await apiDelete("/api/skill", id);
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
          <h1 className="text-lg font-bold text-slate-800">Skills</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Plus size={20} />
              <h2 className="font-bold">{form.id ? "Edit Skill Group" : "Add Skill Category"}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category Type</label>
                <select 
                  value={form.skillType}
                  onChange={(e) => setForm({...form, skillType: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Technical">Technical Skills</option>
                  <option value="Soft">Soft Skills</option>
                  <option value="Tools">Tools & Software</option>
                  <option value="Languages">Languages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Skills (Press Enter)</label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[100px] items-start transition-all focus-within:ring-2 focus-within:ring-blue-500">
                  {skillList.map((skill) => (
                    <span key={skill} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold">
                      {skill}
                      <button type="button" onClick={() => removeChip(skill)} className="hover:text-blue-900">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={skillList.length === 0 ? "e.g. React" : ""}
                    className="flex-1 bg-transparent border-none outline-none text-sm p-1 min-w-[100px]"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Saving..." : <><Save size={18}/> {form.id ? "Update Category" : "Save Skills"}</>}
              </button>
              
              {form.id && (
                <button type="button" onClick={() => {setForm({id: "", skillType: "Technical"}); setSkillList([]);}} className="w-full text-slate-500 text-sm font-medium py-2">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Code2 size={22} className="text-blue-600" /> Skill Inventory
          </h2>

          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                No skills added yet.
              </div>
            ) : (
              data.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
                        {item.skillType}
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.skillName.split(";").map((s: string) => (
                          <span key={s} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition">
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