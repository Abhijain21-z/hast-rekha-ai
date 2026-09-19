import { Skeleton } from "@/components/ui";

export default function SiteLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-14 w-full max-w-md" />
          <Skeleton className="h-14 w-3/4 max-w-sm" />
          <Skeleton className="h-24 w-full max-w-lg" />
          <div className="flex gap-3"><Skeleton className="h-12 w-44 rounded-full" /><Skeleton className="h-12 w-40 rounded-full" /></div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[440px]">
          <div className="absolute inset-[10%] animate-pulse-glow rounded-full border border-gold-400/30 bg-mystic-700/20 blur-md" />
          <div className="absolute inset-[28%] animate-pulse-glow rounded-full border border-gold-400/40" />
        </div>
      </div>
    </div>
  );
}
