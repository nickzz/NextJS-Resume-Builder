"use client";

import Link from "next/link";
import { 
  UserCircle, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Award, 
  Languages, 
  Users, 
  ArrowLeft,
  Settings
} from "lucide-react"; // Using icons consistent with your package.json

export default function AdminDashboard() {
  const sections = [
    { 
      name: "Top Resume Info", 
      path: "/profile/resume", 
      description: "Personal details, contact info, and profile picture",
      icon: <UserCircle size={24} />,
      color: "bg-blue-50 text-blue-600"
    },
    { 
      name: "Experience", 
      path: "/profile/experience", 
      description: "Work history, responsibilities, and key achievements",
      icon: <Briefcase size={24} />,
      color: "bg-indigo-50 text-indigo-600"
    },
    { 
      name: "Education", 
      path: "/profile/education", 
      description: "Academic background, degrees, and institutions",
      icon: <GraduationCap size={24} />,
      color: "bg-emerald-50 text-emerald-600"
    },
    { 
      name: "Skills", 
      path: "/profile/skill", 
      description: "Technical competencies and professional tools",
      icon: <Wrench size={24} />,
      color: "bg-amber-50 text-amber-600"
    },
    { 
      name: "Certificates", 
      path: "/profile/certificate", 
      description: "Professional certifications and licenses",
      icon: <Award size={24} />,
      color: "bg-purple-50 text-purple-600"
    },
    { 
      name: "Languages", 
      path: "/profile/language", 
      description: "Language proficiency and communication skills",
      icon: <Languages size={24} />,
      color: "bg-rose-50 text-rose-600"
    },
    { 
      name: "References", 
      path: "/profile/reference", 
      description: "Professional contacts for verification",
      icon: <Users size={24} />,
      color: "bg-cyan-50 text-cyan-600"
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-medium transition mb-4"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Resume Editor
            </h1>
            <p className="text-slate-500 mt-1">
              Select a section to refine and update your professional profile.
            </p>
          </div>
        </header>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((sec) => (
            <Link
              key={sec.path}
              href={sec.path}
              className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-start"
            >
              <div className={`p-3 rounded-xl mb-4 transition-colors ${sec.color} group-hover:bg-blue-600 group-hover:text-white`}>
                {sec.icon}
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-2">{sec.name}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {sec.description}
              </p>
              
              <div className="mt-6 pt-4 border-t border-slate-50 w-full flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                  Open Editor
                </span>
                <div className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                  <ChevronRightIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

// Simple internal icon component for clean code
function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}