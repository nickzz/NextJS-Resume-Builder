import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Guard: If session or user ID is missing, return 401
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resume = await prisma.resume.findUnique({
      where: { 
        userId: (session.user as any).id // Use the mapped ID
      },
      include: {
        experiences: true,
        educations: true,
        skills: true,
        certificates: true,
        languages: true,
        references: true,
      },
    });

    return NextResponse.json(resume ? [resume] : []);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const userId = (session.user as any).id;

    // Use upsert: if resume exists for this user, update it. If not, create it.
    const resume = await prisma.resume.upsert({
      where: { userId: userId },
      update: {
        fullName: data.fullName,
        position: data.position,
        address: data.address,
        phone: data.phone,
        email: data.email,
        linkedin: data.linkedin,
        github: data.github,
        profileImage: data.profileImage,
        careerSummary: data.careerSummary,
      },
      create: {
        userId: userId,
        fullName: data.fullName,
        position: data.position,
        address: data.address,
        phone: data.phone,
        email: data.email,
        linkedin: data.linkedin,
        github: data.github,
        profileImage: data.profileImage,
        careerSummary: data.careerSummary,
      },
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}

// ✅ DELETE a resume
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.resume.delete({ where: { id } });
    return NextResponse.json({ message: "Resume deleted" });
  } catch (error) {
    console.error("DELETE /resume error:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
