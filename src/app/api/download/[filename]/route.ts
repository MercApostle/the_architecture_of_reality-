import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const FILE_MAP: Record<string, { systemName: string; downloadName: string }> = {
  "the-architecture-of-reality.pdf": {
    systemName: "The Architecture of Reality.pdf",
    downloadName: "The Architecture of Reality.pdf",
  },
  "the-master-blueprint.pdf": {
    systemName: "1. The Master Blueprint.pdf",
    downloadName: "Book 1 - The Master Blueprint.pdf",
  },
  "the-genesis-lens.pdf": {
    systemName: "2. The Genesis Lens.pdf",
    downloadName: "Book 2 - The Genesis Lens.pdf",
  },
  "the-covenant.pdf": {
    systemName: "3. The Covenant.pdf",
    downloadName: "Book 3 - The Covenant.pdf",
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeKey = path.basename(filename).toLowerCase();
  const fileConfig = FILE_MAP[safeKey];

  const actualFilename = fileConfig ? fileConfig.systemName : path.basename(filename);
  const downloadFilename = fileConfig ? fileConfig.downloadName : actualFilename;

  const filePath = path.join(process.cwd(), "public", "pdfs", actualFilename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Document not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${downloadFilename}"`,
      "Content-Length": fileBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
