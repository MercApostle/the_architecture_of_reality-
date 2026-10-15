import type { Metadata } from "next";
import MemberPortal from "@/components/members/MemberPortal";

export const metadata: Metadata = {
  title: "Log In — Sovereign Member Portal · The Architecture of Reality",
  description:
    "Log in to your sovereign member portal to access the digital vault, video curriculum, and private dispatches.",
};

export default function LoginPage() {
  return <MemberPortal initialMode="signin" />;
}
