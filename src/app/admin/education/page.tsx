"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export default function EducationForm() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    resumeId: "",
    degree: "",
    university: "",
    startYear: "",
    endYear: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await apiGet("/api/education");
    setData(res);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (form.id) await apiPut("/api/education", form);
    else await apiPost("/api/education", form);
    setForm({ id: "", resumeId: "", degree: "", university: "", startYear: "", endYear: "" });
    fetchData();
  }

  function handleEdit(item: any) {
    setForm(item);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this record?")) {
      await apiDelete("/api/education", id);
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

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Education</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-4"
      >
        {["degree", "university", "startYear", "endYear"].map((key) => (
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
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition" type="submit">
          {form.id ? "Update" : "Add"}
        </button>
      </form>

      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Existing Records</h2>
        <ul className="space-y-3">
          {data.map((edu) => (
            <li key={edu.id} className="bg-white p-4 shadow-sm rounded-md border flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{edu.degree}</p>
                <p className="text-sm text-gray-600">
                  {edu.university} ({edu.startYear} - {edu.endYear})
                </p>
              </div>
              <div className="flex gap-3 text-sm mt-1">
                <button onClick={() => handleEdit(edu)} className="text-blue-600 hover:text-blue-700">
                  Edit
                </button>
                <button onClick={() => handleDelete(edu.id)} className="text-red-600 hover:text-red-700">
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
