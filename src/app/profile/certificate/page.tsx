"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { ArrowLeft, Award, Calendar, Trash2, Edit3, Plus, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CertificateForm() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    certName: "",
    issuedBy: "",
    issuedDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiGet("/api/certificate");
      setData(res);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.certName.trim()) return alert("Certificate name is required");
    setLoading(true);

    try {
      if (form.id) {
        await apiPut("/api/certificate", form);
      } else {
        const { id, ...createData } = form;
        await apiPost("/api/certificate", createData);
      }
      
      setForm({ id: "", certName: "", issuedBy: "", issuedDate: "", expiryDate: "" });
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
    if (!confirm("Remove this certificate?")) return;
    try {
      await apiDelete("/api/certificate", id);
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
          <h1 className="text-lg font-bold text-slate-800">Certificates</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Plus size={20} />
              <h2 className="font-bold">{form.id ? "Edit Certificate" : "Add Certificate"}</h2>
            </div>

            <div className="space-y-4">
              <InputField label="Certificate Name" value={form.certName} onChange={(v: string) => setForm({...form, certName: v})} placeholder="AWS Certified Solutions Architect" />
              <InputField label="Issuing Organization" value={form.issuedBy} onChange={(v: string) => setForm({...form, issuedBy: v})} placeholder="Amazon Web Services" />
              
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Issued Date" value={form.issuedDate} onChange={(v: string) => setForm({...form, issuedDate: v})} placeholder="Jan 2024" />
                <InputField label="Expiry Date" value={form.expiryDate} onChange={(v: string) => setForm({...form, expiryDate: v})} placeholder="Jan 2027 (or N/A)" />
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Saving..." : <><Save size={18}/> {form.id ? "Update Record" : "Save Certificate"}</>}
              </button>
              
              {form.id && (
                <button type="button" onClick={() => setForm({id: "", certName: "", issuedBy: "", issuedDate: "", expiryDate: ""})} className="w-full text-slate-500 text-sm font-medium py-2">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck size={22} className="text-blue-600" /> Credential Wallet
          </h2>

          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                No certificates added yet.
              </div>
            ) : (
              data.map((cert) => (
                <div key={cert.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit">
                        <Award size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cert.certName}</h3>
                        <p className="text-slate-600 font-medium">{cert.issuedBy}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Issued: {cert.issuedDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ShieldCheck size={14} />
                            <span>Expires: {cert.expiryDate || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(cert)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(cert.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition">
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