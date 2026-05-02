import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid collisions
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return the virtual path that the backend can use
    // In this architecture, /uploads is served statically by Next.js
    const virtualPath = `http://localhost:3000/uploads/${filename}`;

    return NextResponse.json({ virtualPath });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
