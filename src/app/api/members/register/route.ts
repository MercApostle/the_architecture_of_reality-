import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "registered-members.json");

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  tier?: string;
  memberSince?: string;
  points?: number;
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

function saveMembers(members: MemberRecord[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to registered-members.json (read-only filesystem or serverless):", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawId = body.id || body.name;
    const rawEmail = body.email;

    if (!rawId || typeof rawId !== "string" || !rawId.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid name for your Member User ID." },
        { status: 400 }
      );
    }

    const cleanId = rawId.trim();
    if (cleanId.length < 2) {
      return NextResponse.json(
        { success: false, error: "Member User ID must be at least 2 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = (rawEmail || "").trim().toLowerCase();
    if (!cleanEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const members = getStoredMembers();
    const lowerId = cleanId.toLowerCase();

    // Enforce NO DUPLICATE User IDs allowed
    const duplicate = members.find((m) => {
      // If same email is re-saving their own profile, permit it
      if (m.email.toLowerCase() === cleanEmail) {
        return false;
      }
      return m.id.toLowerCase() === lowerId || m.name.toLowerCase() === lowerId;
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          error: `The Member User ID "${cleanId}" is already taken. Please choose a different unique name.`,
        },
        { status: 409 }
      );
    }

    // Update existing member record by email or push new record
    const existingIndex = members.findIndex((m) => m.email.toLowerCase() === cleanEmail);
    const newRecord: MemberRecord = {
      id: cleanId,
      name: cleanId,
      email: cleanEmail,
      tier: "paid",
      memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      points: 500,
    };

    if (existingIndex >= 0) {
      members[existingIndex] = { ...members[existingIndex], ...newRecord };
    } else {
      members.push(newRecord);
    }

    saveMembers(members);

    return NextResponse.json({
      success: true,
      member: newRecord,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal registration error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
