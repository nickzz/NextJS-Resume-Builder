"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "@/lib/api";

export default function ResumeForm() {
  const [form, setForm] = useState({
    id: "",
    fullName: "",
    position: "",
    address: "",
    phone: "",
    email: "", // 👈 Added email field
    linkedin: "",
    github: "",
    profileImage: "",
    careerSummary: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiGet("/api/resume");
      if (res.length > 0) setForm(res[0]);
    } catch (e) {
      console.error(e);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) await apiPut("/api/resume", form);
      else await apiPost("/api/resume", form);
      alert("Resume saved successfully!");
    } catch (e) {
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Navigation Back Button */}
      <div className="w-full max-w-xl mb-4">
        <button
          type="button"
          onClick={() => (window.location.href = "/admin")}
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
        </button>
      </div>

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Top Resume Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image Upload */}
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Picture
            </label>

            {/* Profile image preview */}
            <div className="relative w-32 h-32">
              <img
                src={
                  form.profileImage ||
                  "https://via.placeholder.com/150x150.png?text=No+Image"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-sm"
                style={{ objectPosition: "50% 30%" }}
              />
            </div>

            {/* Upload button */}
            <label
              htmlFor="file-upload"
              className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md shadow-sm transition"
            >
              {form.profileImage ? "Change Photo" : "Upload Photo"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Text fields */}
          {[
            "fullName",
            "position",
            "address",
            "phone",
            "email", // 👈 Added email field
            "linkedin",
            "github",
          ].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                value={(form as any)[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          ))}

          {/* Career Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Career Summary
            </label>
            <textarea
              rows={5}
              value={form.careerSummary || ""}
              onChange={(e) =>
                setForm({ ...form, careerSummary: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Write your professional summary here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition shadow-sm"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </main>
  );
}
