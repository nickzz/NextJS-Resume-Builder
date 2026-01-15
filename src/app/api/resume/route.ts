import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// ✅ GET all resume records (usually 1 for this app)
// export async function GET() {
//   try {
//     console.log("🔍 [API] Trying to fetch resume records...");
//     const resumes = await prisma.resume.findMany();
//     console.log("✅ [API] Resumes fetched:", resumes.length);
//     return NextResponse.json(resumes);
//   } catch (err: any) {
//     console.error("❌ [API] Prisma Error:", err);
//     return NextResponse.json({ message: err.message, stack: err.stack }, { status: 500 });
//   }
// }
export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      include: {
        experiences: true,
        educations: true,
        skills: true,
        certificates: true,
        languages: true,
        references: true,
      },
    });
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("GET /resume error:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

// ✅ POST create new resume
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const resume = await prisma.resume.create({ data });
    return NextResponse.json(resume);
  } catch (error) {
    console.error("POST /resume error:", error);
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}

// ✅ PUT update existing resume
// export async function PUT(req: Request) {
//   try {
//     const data = await req.json();
//     const { id, ...rest } = data;
//     const updated = await prisma.resume.update({
//       where: { id },
//       data: rest,
//     });
//     return NextResponse.json(updated);
//   } catch (error) {
//     console.error("PUT /resume error:", error);
//     return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
//   }
// }
export async function PUT(req: Request) {
  try {
    const data = await req.json();

    // Destructure to exclude relational arrays
    const {
      experiences,
      skills,
      educations,
      certificates,
      languages,
      references,
      id,
      ...rest
    } = data;

    // Defensive mapping (explicit fields only)
    const mappedData = {
      fullName: rest.fullName,
      position: rest.position,
      address: rest.address,
      phone: rest.phone,
      email: rest.email,
      linkedin: rest.linkedin,
      github: rest.github,
      profileImage: rest.profileImage,
      careerSummary: rest.careerSummary,
    };

    // Ensure we have an ID to update
    if (!id) {
      return NextResponse.json(
        { error: "Missing resume ID for update" },
        { status: 400 }
      );
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: mappedData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /resume error:", error);
    return NextResponse.json(
      { error: "Failed to update resume", details: error.message },
      { status: 500 }
    );
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
