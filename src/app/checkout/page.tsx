import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Sovereign Checkout & Transmission",
  description:
    "Secure encrypted checkout for The Architecture of Reality field manuals, mastery courses, and sovereign advisory architectures.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
