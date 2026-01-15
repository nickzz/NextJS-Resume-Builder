import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.reference.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await prisma.reference.create({ data: body });
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...rest } = body;
  const updated = await prisma.reference.update({ where: { id }, data: rest });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.reference.delete({ where: { id } });
  return NextResponse.json({ message: "Reference deleted" });
}
