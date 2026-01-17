"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import Link from "next/link";

// Import TipTap dynamically to avoid SSR hydration issues
const EditorComponent = dynamic(() => import("@/components/TiptapEditor"), { ssr: false });

export default function ExperienceForm() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    resumeId: "",
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await apiGet("/api/experience");
    setData(res);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (form.id) await apiPut("/api/experience", form);
    else await apiPost("/api/experience", form);
    setForm({
      id: "",
      resumeId: "",
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    fetchData();
  }

  function handleEdit(item: any) {
    setForm(item);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this record?")) {
      await apiDelete("/api/experience", id);
      fetchData();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Back Navigation */}
      <div className="w-full max-w-3xl mb-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
        >
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
          Back to Admin
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Work Experience</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-4"
      >
        {/* Text Fields */}
        {["title", "company", "startDate", "endDate"].map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* TipTap Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <EditorComponent
            content={form.description}
            onChange={(html) => setForm({ ...form, description: html })}
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          type="submit"
        >
          {form.id ? "Update Experience" : "Add Experience"}
        </button>
      </form>

      {/* Records */}
      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Existing Records
        </h2>
        <ul className="space-y-3">
          {data.map((exp) => (
            <li
              key={exp.id}
              className="bg-white p-4 shadow-sm rounded-md border flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-gray-800">{exp.title}</p>
                <p className="text-sm text-gray-600">
                  {exp.company} ({exp.startDate} - {exp.endDate})
                </p>
                <div
                  className="mt-2 text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                ></div>
              </div>
              <div className="flex gap-3 text-sm mt-1">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
