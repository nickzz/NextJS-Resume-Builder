"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const sections = [
    { name: "Top Resume Info", path: "/admin/resume" },
    { name: "Experience", path: "/admin/experience" },
    { name: "Education", path: "/admin/education" },
    { name: "Skills", path: "/admin/skill" },
    { name: "Certificates", path: "/admin/certificate" },
    { name: "Languages", path: "/admin/language" },
    { name: "References", path: "/admin/reference" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* ===== Back Navigation Button ===== */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => (window.location.href = "/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
        >
          {/* Left arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* ===== Page Title ===== */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resume Admin Dashboard</h1>

      {/* ===== Grid of Sections ===== */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map((sec) => (
          <Link
            key={sec.path}
            href={sec.path}
            className="p-6 bg-white shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-600">{sec.name}</h2>
            <p className="text-sm text-gray-500 mt-2">Manage {sec.name.toLowerCase()} content</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
