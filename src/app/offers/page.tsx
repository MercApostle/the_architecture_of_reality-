import type { Metadata } from "next";
import OffersCatalog from "@/components/offers/OffersCatalog";
import { PageHero } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Offers & Advisory — Field Manuals, Mastery Course & Systems Sprint",
  description:
    "Curated operating tools for sovereign operators: downloadable field manuals, the flagship Sovereign Operator Mastery Course, and 1-on-1 advisory architecture.",
};

export default function OffersPage() {
  return (
    <>
      <PageHero
        eyebrow="Curated Deployments &amp; Advisory"
        title={
          <>
            Operating Systems &amp; <span className="text-gradient-gold italic">Advisory</span>
          </>
        }
        lede="From tactical daily field manuals and the 80-Hour Work Month academy, to private 1-on-1 social architecture for purposeful enterprises."
      />
      <OffersCatalog />
    </>
  );
}
