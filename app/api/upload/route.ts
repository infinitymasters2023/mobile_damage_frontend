import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

/**
 * Server-side route to save files to F:\ drive with 
 * dynamic Year/Month folder structure and return a public URL.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Generate dynamic Date variables for Year/Month
    const now = new Date();
    const year = now.getFullYear().toString(); // e.g., "2026"
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // e.g., "03"

    // 2. Define the Physical Storage Path (F:\ drive)
    // Results in: F:\Documents\OCRToText\2026\03
    const physicalUploadDir = path.join("F:", "Documents", "OCRToText", year, month);

    // 3. Ensure the folder structure exists on the F drive
    // recursive: true ensures all parent folders are created
    await mkdir(physicalUploadDir, { recursive: true });

    // 4. Create a unique filename
    // Format: TIMESTAMP-FILENAME (spaces replaced by underscores)
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const physicalFilePath = path.join(physicalUploadDir, uniqueName);

    // 5. Convert file to Buffer and Write to Disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(physicalFilePath, buffer);

    // 6. Construct the Virtual URL for the Frontend
    // Mapping F:\ to https://doc.infyshield.com/
    const virtualPath = `https://doc.infyshield.com/Documents/OCRToText/${year}/${month}/${uniqueName}`;

    // 7. Success Response
    return NextResponse.json({
      success: true,
      virtualPath, // Used by your frontend for OCR and Display
      fileName: uniqueName,
      internalPath: physicalFilePath // Useful for server-side logging
    });

  } catch (error: any) {
    console.error("Critical Upload Error:", error);

    // Handle common file system errors
    let errorMessage = "Internal Server Error";
    if (error.code === 'ENOENT') errorMessage = "Drive F: not found or unreachable";
    if (error.code === 'EPERM') errorMessage = "Permission denied on F: drive";

    return NextResponse.json(
      { error: errorMessage, details: error.message }, 
      { status: 500 }
    );
  }
}