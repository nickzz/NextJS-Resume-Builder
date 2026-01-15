"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export default function SkillForm() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", resumeId: "", skillName: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await apiGet("/api/skill");
    setData(res);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.skillName.trim()) return alert("Please enter a skill name");

    if (form.id) await apiPut("/api/skill", form);
    else {
      const { id, ...cleanForm } = form; // 🧹 remove id before sending
      await apiPost("/api/skill", cleanForm);
    }

    setForm({ id: "", resumeId: "", skillName: "" });
    fetchData();
  }

  function handleEdit(item: any) {
    setForm(item);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this skill?")) {
      await apiDelete("/api/skill", id);
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admin
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Technical Skills</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Skill Name</label>
          <input
            type="text"
            value={form.skillName}
            onChange={(e) => setForm({ ...form, skillName: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. React, Node.js, PostgreSQL"
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          type="submit"
        >
          {form.id ? "Update Skill" : "Add Skill"}
        </button>
      </form>

      {/* Skill List */}
      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Existing Skills</h2>

        <div className="flex flex-wrap gap-3">
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm">No skills added yet.</p>
          ) : (
            data.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 bg-white px-4 py-2 border rounded-full shadow-sm"
              >
                <span className="text-sm font-medium text-gray-800">{skill.skillName}</span>
                <div className="flex gap-1 text-xs">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Edit
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
