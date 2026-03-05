import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Generate dynamic Date variables
    const now = new Date();
    const year = now.getFullYear().toString(); // "2026"
    
    // Get Full Month Name (e.g., "February")
    const monthName = now.toLocaleString('default', { month: 'long' }); 

    // 2. Define the Physical Storage Path on F:
    // This results in: F:\Documents\OCRToText\2026\February
    const physicalUploadDir = path.join("F:", "Documents", "OCRToText", year, monthName);

    // 3. Drive Check (Crucial for Windows local dev)
    if (!existsSync("F:")) {
      throw new Error("Drive F: is not mounted or inaccessible.");
    }

    // 4. Ensure the folder structure exists
    await mkdir(physicalUploadDir, { recursive: true });

    // 5. Create a unique filename
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const physicalFilePath = path.join(physicalUploadDir, uniqueName);

    // 6. Convert file to Buffer and Write to Disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(physicalFilePath, buffer);

    // 7. Construct the Virtual URL 
    // Format: https://doc.infyshield.com/Documents/OCRToText/2026/February/filename.jpg
    const virtualPath = `https://doc.infyshield.com/Documents/OCRToText/${year}/${monthName}/${uniqueName}`;

    return NextResponse.json({
      success: true,
      virtualPath,
      fileName: uniqueName,
      internalPath: physicalFilePath
    });

  } catch (error: any) {
    console.error("Critical Upload Error:", error);

    return NextResponse.json(
      { 
        error: error.message || "Internal Server Error",
        code: error.code 
      }, 
      { status: 500 }
    );
  }
}