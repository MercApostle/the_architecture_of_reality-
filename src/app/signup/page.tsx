import type { Metadata } from "next";
import MemberPortal from "@/components/members/MemberPortal";

export const metadata: Metadata = {
  title: "Sign Up — Sovereign Member Portal · The Architecture of Reality",
  description:
    "Create your member account to access the sovereign operator vault, curriculum modules, and tactical manuals.",
};

export default function SignUpPage() {
  return <MemberPortal initialMode="signup" />;
}
