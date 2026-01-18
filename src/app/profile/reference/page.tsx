"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { ArrowLeft, UserCheck, Trash2, Edit3, Plus, Save, Mail, Phone, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ReferenceForm() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    refName: "",
    company: "",
    position: "",
    phoneNo: "",
    email: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiGet("/api/reference");
      setData(res);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.refName.trim()) return alert("Reference name is required");
    setLoading(true);

    try {
      if (form.id) {
        await apiPut("/api/reference", form);
      } else {
        const { id, ...createData } = form;
        await apiPost("/api/reference", createData);
      }
      
      setForm({ id: "", refName: "", company: "", position: "", phoneNo: "", email: "" });
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
    if (!confirm("Remove this reference?")) return;
    try {
      await apiDelete("/api/reference", id);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition">
            <ArrowLeft size={18} /> <span>Back to Profile</span>
          </Link>
          <h1 className="text-lg font-bold text-slate-800">Professional References</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Plus size={20} />
              <h2 className="font-bold">{form.id ? "Edit Reference" : "Add New Reference"}</h2>
            </div>

            <div className="space-y-4">
              <InputField label="Full Name" value={form.refName} onChange={(v: string) => setForm({...form, refName: v})} placeholder="e.g. Jane Smith" />
              <InputField label="Position" value={form.position} onChange={(v: string) => setForm({...form, position: v})} placeholder="e.g. Senior Manager" />
              <InputField label="Company" value={form.company} onChange={(v: string) => setForm({...form, company: v})} placeholder="e.g. Tech Solutions Inc." />
              
              <div className="grid grid-cols-1 gap-4">
                <InputField label="Email Address" value={form.email} onChange={(v: string) => setForm({...form, email: v})} placeholder="jane.smith@example.com" />
                <InputField label="Phone Number" value={form.phoneNo} onChange={(v: string) => setForm({...form, phoneNo: v})} placeholder="+6012-3456789" />
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Saving..." : <><Save size={18}/> {form.id ? "Update" : "Save Reference"}</>}
              </button>
              
              {form.id && (
                <button type="button" onClick={() => setForm({id: "", refName: "", company: "", position: "", phoneNo: "", email: ""})} className="w-full text-slate-500 text-sm font-medium py-2">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserCheck size={22} className="text-blue-600" /> Reference List
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {data.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                No references added yet.
              </div>
            ) : (
              data.map((ref) => (
                <div key={ref.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ref.refName}</h3>
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <Briefcase size={14} className="text-slate-400" />
                          <span>{ref.position} at {ref.company}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail size={14} />
                          <span>{ref.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Phone size={14} />
                          <span>{ref.phoneNo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(ref)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(ref.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition">
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