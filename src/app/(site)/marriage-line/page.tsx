import { PalmGuide, palmGuideMetadata, type PalmSearchParams } from "@/components/palm/Route";

export const generateMetadata = palmGuideMetadata("marriage-line");

export default function Page({ searchParams }: { searchParams: PalmSearchParams }) {
  return <PalmGuide slug="marriage-line" searchParams={searchParams} />;
}
