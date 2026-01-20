// src/app/api/resume/generate/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { mapToJSONResume } from "@/lib/json-resume-mapper";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { theme } = await req.json();
    const userId = (session.user as any).id;

    // Fetch full resume with all relations
    const resume = await prisma.resume.findUnique({
      where: { userId: userId },
      include: {
        experiences: true,
        educations: true,
        skills: true,
        certificates: true,
        languages: true,
        references: true,
      },
    });

    if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const jsonResumeData = mapToJSONResume(resume);

    // Save to generation history
    const savedGeneration = await prisma.generatedResume.create({
      data: {
        userId: userId,
        resumeId: resume.id,
        theme: theme,
        jsonContent: jsonResumeData as any,
      }
    });

    return NextResponse.json({ 
      message: "Resume generated successfully", 
      data: jsonResumeData,
      generationId: savedGeneration.id 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const history = await prisma.generatedResume.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(history);
}