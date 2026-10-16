import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "registered-members.json");

interface MemberRecord {
  id: string;
  name: string;
  email: string;
}

function getStoredMembers(): MemberRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read registered-members.json:", err);
  }
  return [
    {
      id: "Marcus Sterling",
      name: "Marcus Sterling",
      email: "member@architectureofreality.com",
    },
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("id");
  const currentEmail = searchParams.get("email")?.trim().toLowerCase();

  if (!rawId || !rawId.trim()) {
    return NextResponse.json({ available: false, error: "Please enter a valid User ID." }, { status: 400 });
  }

  const cleanId = rawId.trim();

  if (cleanId.length < 2) {
    return NextResponse.json(
      { available: false, error: "User ID must be at least 2 characters long." },
      { status: 400 }
    );
  }

  const members = getStoredMembers();
  const lower = cleanId.toLowerCase();

  const match = members.find((m) => {
    // If the check is for the current user's existing email, they own their ID
    if (currentEmail && m.email.toLowerCase() === currentEmail) {
      return false;
    }
    return m.id.toLowerCase() === lower || m.name.toLowerCase() === lower;
  });

  if (match) {
    return NextResponse.json({
      available: false,
      error: `The User ID "${cleanId}" is already taken. Please choose another unique name.`,
    });
  }

  return NextResponse.json({
    available: true,
    id: cleanId,
    message: `User ID "${cleanId}" is available.`,
  });
}
