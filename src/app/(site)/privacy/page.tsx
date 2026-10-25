import { permanentRedirect } from "next/navigation";

/**
 * Meta App Dashboard requires a Privacy Policy URL. The real policy lives at
 * `/privacy-policy`; this alias keeps the shorter `/privacy` link working for
 * Meta review and for anyone who types it directly.
 */
export default function PrivacyAliasPage() {
  permanentRedirect("/privacy-policy");
}
