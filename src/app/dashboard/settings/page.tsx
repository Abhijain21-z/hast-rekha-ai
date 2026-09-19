import { requireUser } from "@/lib/auth";
import SettingsForm from "@/components/dashboard/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  return <SettingsForm user={{ name: user.name, email: user.email, preferredLang: user.preferredLang, createdAt: user.createdAt.toISOString() }} />;
}
