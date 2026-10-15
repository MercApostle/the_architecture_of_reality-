import type { Metadata } from "next";
import MemberPortal from "@/components/members/MemberPortal";

export const metadata: Metadata = {
  title: "Member Vault & Academy — The Architecture of Reality",
  description:
    "Private member dashboard and sovereign reading vault for enrolled operators. Access full digital manuscripts, curriculum modules, and field manuals.",
};

export default function MembersPage() {
  return <MemberPortal />;
}
