import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.skill.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  // 🚫 Remove ID if accidentally passed from frontend
  const { id, ...cleanData } = body;

  const created = await prisma.skill.create({ data: cleanData });
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...rest } = body;
  const updated = await prisma.skill.update({ where: { id }, data: rest });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ message: "Skill deleted" });
}
