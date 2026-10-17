import { PalmGuide, palmGuideMetadata, type PalmSearchParams } from "@/components/palm/Route";

export const generateMetadata = palmGuideMetadata("money-line");

export default function Page({ searchParams }: { searchParams: PalmSearchParams }) {
  return <PalmGuide slug="money-line" searchParams={searchParams} />;
}
