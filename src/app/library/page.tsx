import type { Metadata } from "next";
import ReadingRoom from "@/components/library/ReadingRoom";
import { PageHero } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "The Trilogy Library & Reading Room",
  description:
    "Explore the foundational texts: Book 1 (The Master Blueprint), Book 2 (The Genesis Lens), and Book 3 (The Covenant) with interactive reading chapters and downloadable companion tools.",
};

export default function LibraryPage() {
  return (
    <>
      <PageHero
        eyebrow="The Trilogy"
        title={
          <>
            The Library &amp; <span className="text-gradient-gold italic">Reading Room</span>
          </>
        }
        lede="Three volumes mapping the energy architecture of the human vessel, the seven-fold code of creation, and load-bearing social covenants for sovereign enterprises."
      />
      <ReadingRoom />
    </>
  );
}
