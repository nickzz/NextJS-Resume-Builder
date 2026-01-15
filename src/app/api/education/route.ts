import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.education.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const education = await prisma.education.create({ data });
    return NextResponse.json(education);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...rest } = data;
    const updated = await prisma.education.update({ where: { id }, data: rest });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ message: "Education deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
