import { PalmGuide, palmGuideMetadata, type PalmSearchParams } from "@/components/palm/Route";

export const generateMetadata = palmGuideMetadata("life-line");

export default function Page({ searchParams }: { searchParams: PalmSearchParams }) {
  return <PalmGuide slug="life-line" searchParams={searchParams} />;
}
