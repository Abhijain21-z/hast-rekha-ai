import { PalmGuide, palmGuideMetadata, type PalmSearchParams } from "@/components/palm/Route";

export const generateMetadata = palmGuideMetadata("career-line");

export default function Page({ searchParams }: { searchParams: PalmSearchParams }) {
  return <PalmGuide slug="career-line" searchParams={searchParams} />;
}
