"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export default function LanguageForm() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    resumeId: "",
    language: "",
    proficiency: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await apiGet("/api/language");
    setData(res);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.language.trim()) return alert("Language name is required");

    if (form.id) await apiPut("/api/language", form);
    else await apiPost("/api/language", form);

    setForm({ id: "", resumeId: "", language: "", proficiency: "" });
    fetchData();
  }

  function handleEdit(item: any) {
    setForm(item);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this language?")) {
      await apiDelete("/api/language", id);
      fetchData();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Back Navigation */}
      <div className="w-full max-w-3xl mb-4">
        <Link
          href="/admin"
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

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Languages</h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <input
            type="text"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. English"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Proficiency</label>
          <select
            value={form.proficiency}
            onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select proficiency</option>
            <option value="Native">Native</option>
            <option value="Fluent">Fluent</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          {form.id ? "Update Language" : "Add Language"}
        </button>
      </form>

      {/* Language List */}
      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Existing Languages</h2>
        <ul className="space-y-3">
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm">No languages added yet.</p>
          ) : (
            data.map((lang) => (
              <li
                key={lang.id}
                className="bg-white p-4 shadow-sm rounded-md border flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold text-gray-800">{lang.language}</p>
                  <p className="text-sm text-gray-600">{lang.proficiency}</p>
                </div>
                <div className="flex gap-3 text-sm mt-1">
                  <button
                    onClick={() => handleEdit(lang)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lang.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
