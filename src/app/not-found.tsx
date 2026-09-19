import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mandala-bg flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-8xl text-gold-300 drop-shadow-[0_0_24px_rgba(245,194,66,0.5)]">☾</p>
      <h1 className="mt-6 font-display text-3xl text-white sm:text-4xl">Page not found · पृष्ठ नहीं मिला</h1>
      <p className="mt-3 max-w-md text-sm text-slate-400">The stars could not locate this page. It may have been moved or the reading link has expired.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-gold rounded-full px-6 py-3 text-sm">Home</Link>
        <Link href="/reading" className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-200 hover:border-gold-400/50">Get Your Reading</Link>
      </div>
    </div>
  );
}
