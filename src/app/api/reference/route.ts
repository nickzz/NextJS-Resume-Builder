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
    const data = await prisma.reference.findMany({
      where: { resumeId },
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
    const body = await req.json();
    const { id, ...data } = body;
    const resumeId = await getResumeId((session.user as any).id);

    if (!resumeId) return NextResponse.json({ error: "Resume not found" }, { status: 400 });

    const created = await prisma.reference.create({
      data: { ...data, resumeId },
    });
    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, resumeId, ...rest } = body;
    const updated = await prisma.reference.update({
      where: { id },
      data: rest,
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
    await prisma.reference.delete({ where: { id } });
    return NextResponse.json({ message: "Reference deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}