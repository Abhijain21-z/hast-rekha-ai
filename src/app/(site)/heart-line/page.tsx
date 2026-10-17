import { PalmGuide, palmGuideMetadata, type PalmSearchParams } from "@/components/palm/Route";

export const generateMetadata = palmGuideMetadata("heart-line");

export default function Page({ searchParams }: { searchParams: PalmSearchParams }) {
  return <PalmGuide slug="heart-line" searchParams={searchParams} />;
}
