import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

async function getResumeId(userId: string) {
  const resume = await prisma.resume.findUnique({
    where: { userId },
  });
  return resume?.id;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resumeId = await getResumeId((session.user as any).id);
    const data = await prisma.education.findMany({
      where: { resumeId },
      orderBy: { endYear: "desc" },
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
    const data = await req.json();
    const resumeId = await getResumeId((session.user as any).id);

    if (!resumeId) {
      return NextResponse.json({ error: "Please complete Top Resume Info first" }, { status: 400 });
    }

    const education = await prisma.education.create({
      data: { ...data, resumeId },
    });
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...data } = await req.json();
    const updated = await prisma.education.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}