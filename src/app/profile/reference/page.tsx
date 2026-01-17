"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export default function ReferenceForm() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    resumeId: "",
    refName: "",
    company: "",
    contact: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await apiGet("/api/reference");
    setData(res);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.refName.trim()) return alert("Reference name is required");

    if (form.id) await apiPut("/api/reference", form);
    else await apiPost("/api/reference", form);

    setForm({ id: "", resumeId: "", refName: "", company: "", contact: "" });
    fetchData();
  }

  function handleEdit(item: any) {
    setForm(item);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this reference?")) {
      await apiDelete("/api/reference", id);
      fetchData();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* 🔙 Back Navigation */}
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

      {/* 🧩 Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">References</h1>

      {/* 📝 Reference Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference Name</label>
          <input
            type="text"
            value={form.refName}
            onChange={(e) => setForm({ ...form, refName: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Fujitsu Malaysia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Info</label>
          <input
            type="text"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. john.doe@company.com / +6012-3456789"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          {form.id ? "Update Reference" : "Add Reference"}
        </button>
      </form>

      {/* 📋 Reference List */}
      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Existing References</h2>
        <ul className="space-y-3">
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm">No references added yet.</p>
          ) : (
            data.map((ref) => (
              <li
                key={ref.id}
                className="bg-white p-4 shadow-sm rounded-md border flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold text-gray-800">{ref.refName}</p>
                  <p className="text-sm text-gray-600">{ref.company}</p>
                  <p className="text-xs text-gray-500 mt-1">{ref.contact}</p>
                </div>
                <div className="flex gap-3 text-sm mt-1">
                  <button
                    onClick={() => handleEdit(ref)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ref.id)}
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
