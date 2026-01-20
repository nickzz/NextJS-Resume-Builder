"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  FileText,
  UserCircle,
  LogOut,
  ChevronRight,
  Wand2,
  History
} from "lucide-react"; //
import { signOut, useSession } from "next-auth/react";
import { apiGet } from "@/lib/api";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    async function fetchResume() {
      const res = await apiGet("/api/resume");
      if (res && res.length > 0) setResume(res[0]);
    }
    fetchResume();
  }, []);

  return (
    <main className="min-h-screen bg-[#FDFDFF] text-slate-900">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black text-2xl text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          RESUMAKER
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition"
        >
          <LogOut size={22} />
        </button>
      </header>

      <section className="max-w-5xl mx-auto mt-12 px-8">
        <h1 className="text-4xl font-bold mb-2">Hello, {session?.user?.name || "Ready to build?"}</h1>
        <p className="text-slate-500 mb-12 text-lg">Manage your professional documents and career profile.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create/Edit Card */}
          <a href="/profile" className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
              <PlusCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{resume ? "Update Resume" : "Create Resume"}</h2>
            <p className="text-slate-500 mb-6">Edit your work history, skills, and contact details.</p>
            <span className="text-blue-600 font-bold flex items-center gap-2">
              Go to Editor <ChevronRight size={18} />
            </span>
          </a>

          {/* View/Download Card */}
          {/* <button 
            onClick={() => window.location.href = "/dashboard/preview"}
            disabled={!resume}
            className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition">
              <FileText size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Resume Preview</h2>
            <p className="text-slate-500 mb-6">View your printable resume and export it as a high-quality PDF.</p>
            <span className="text-emerald-600 font-bold flex items-center gap-2">
              View & Download <ChevronRight size={18} />
            </span>
          </button> */}

          {/* NEW: Generate Resume Card */}
          <a href="/dashboard/generate" className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-purple-500 transition-all">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition">
              <Wand2 size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Generate PDF</h2>
            <p className="text-slate-500 mb-6">Choose a JSON Resume theme and export your professional PDF.</p>
            <span className="text-purple-600 font-bold flex items-center gap-2">
              Open Generator <ChevronRight size={18} />
            </span>
          </a>

          {/* NEW: Generation History Card */}
          <a href="/dashboard/history" className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-amber-500 transition-all">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition">
              <History size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-2">History</h2>
            <p className="text-slate-500 mb-6">Access and download your previously generated resumes.</p>
          </a>
        </div>
      </section>
    </main>
  );
}