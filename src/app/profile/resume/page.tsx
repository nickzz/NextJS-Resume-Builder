"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { ArrowLeft, Save, Upload, User, Mail, Phone, MapPin, Linkedin, Github, Briefcase } from "lucide-react";

export default function ResumeForm() {
  const [form, setForm] = useState({
    fullName: "",
    position: "",
    address: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    profileImage: "",
    careerSummary: "",
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiGet("/api/resume");
        console.log(res)
        if (res && res.length > 0) setForm(res[0]);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, []);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/api/resume", form);
      alert("Resume information updated successfully!");
    } catch (e) {
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header / Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => (window.location.href = "/profile")}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>
          <h1 className="text-lg font-bold text-slate-800">Top Resume Info</h1>
          <button
            form="resume-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition shadow-md shadow-blue-100 disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save</>}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <form id="resume-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Profile Image */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Profile Picture</h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative group">
                <img
                  src={form.profileImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-50 shadow-sm transition group-hover:opacity-90"
                />
                <label
                  htmlFor="file-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition rounded-2xl cursor-pointer"
                >
                  <Upload size={24} />
                </label>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-slate-600 text-sm mb-4">
                  Upload a professional headshot. Clear photos help your resume stand out to recruiters.
                </p>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Choose File
                </label>
              </div>
            </div>
          </section>

          {/* Section 2: Contact Details */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Primary Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Full Name" icon={<User size={18}/>} value={form.fullName} onChange={(v) => setForm({...form, fullName: v})} />
              <InputField label="Current Position" icon={<Briefcase size={18}/>} value={form.position} onChange={(v) => setForm({...form, position: v})} />
              <InputField label="Email Address" icon={<Mail size={18}/>} value={form.email} onChange={(v) => setForm({...form, email: v})} />
              <InputField label="Phone Number" icon={<Phone size={18}/>} value={form.phone} onChange={(v) => setForm({...form, phone: v})} />
              <div className="md:col-span-2">
                <InputField label="Address" icon={<MapPin size={18}/>} value={form.address} onChange={(v) => setForm({...form, address: v})} />
              </div>
            </div>
          </section>

          {/* Section 3: Social Links */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="LinkedIn URL" icon={<Linkedin size={18}/>} value={form.linkedin} onChange={(v) => setForm({...form, linkedin: v})} />
              <InputField label="GitHub URL" icon={<Github size={18}/>} value={form.github} onChange={(v) => setForm({...form, github: v})} />
            </div>
          </section>

          {/* Section 4: Summary */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Professional Summary</h2>
            <textarea
              rows={6}
              value={form.careerSummary || ""}
              onChange={(e) => setForm({ ...form, careerSummary: e.target.value })}
              className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-slate-700"
              placeholder="Briefly describe your professional background and key strengths..."
            ></textarea>
          </section>
        </form>
      </div>
    </main>
  );
}

function InputField({ label, icon, value, onChange }: { label: string, icon: React.ReactNode, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-slate-700"
          placeholder={`Enter your ${label.toLowerCase()}...`}
        />
      </div>
    </div>
  );
}