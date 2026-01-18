import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resume = await prisma.resume.findUnique({
      where: { userId: (session.user as any).id },
    });

    const data = await prisma.experience.findMany({
      where: { resumeId: resume?.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Destructure to ensure we don't accidentally pull an empty "id" from the frontend
    const { id, ...data } = await req.json(); 

    const resume = await prisma.resume.findUnique({
      where: { userId: (session.user as any).id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Please create a Resume Profile first" }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: {
        ...data,
        resumeId: resume.id, // Link to the user's resume
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const data = await req.json();
  const { id, resumeId, ...rest } = data;
  try {
    const updated = await prisma.experience.update({
      where: { id },
      data: rest,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE experience
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();

    await prisma.experience.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Record deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
