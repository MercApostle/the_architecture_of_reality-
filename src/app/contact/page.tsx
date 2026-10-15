import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contacts & Direct Inquiries — The Architecture of Reality",
  description:
    "Direct communication channel for Jeremy Ashe, executive advisory inquiries, speaking engagements, and reader correspondence.",
};

export default function ContactPage() {
  return <ContactView />;
}
