import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type, content, position } = await req.json();

    // 1. Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 2. Craft the Prompt based on the type
    let prompt = "";
    if (type === "summary") {
      prompt = `As an expert career coach, optimize this professional resume summary for a ${position} role. 
                STRICT RULES:
                1. Return ONLY the optimized paragraph.
                2. Do not include introductory text like "Here is a suggestion".
                3. Keep it between 40-60 words.
                4. Focus on impact, years of experience, and key technical skills.
                Original content: "${content}"`;
    } else if (type === "experience") {
      prompt = `As an expert recruiter, rewrite these job responsibilities for a ${position} role. 
          Use the STAR method (Situation, Task, Action, Result). 
          
          STRICT RULES:
          1. Return ONLY the content. 
          2. No introductory text. 
          3. Use a semicolon (;) to separate each bullet point. 
          4. No bullet point symbols or numbers.
          
          Content to optimize: "${content}"`;
    }

    // 3. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ suggestion: text.trim() });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "AI Optimization failed" }, { status: 500 });
  }
}