import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all experience
export async function GET() {
  try {
    const data = await prisma.experience.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

// POST new experience
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const experience = await prisma.experience.create({ data });
    return NextResponse.json(experience);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

// PUT update experience
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...rest } = data;
    const updated = await prisma.experience.update({ where: { id }, data: rest });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

// DELETE experience
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ message: "Experience deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
