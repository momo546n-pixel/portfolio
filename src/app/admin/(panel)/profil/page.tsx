import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/admin/profile-form";
import type { Profile } from "@/lib/types";

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Profil</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Vos informations « À propos », vos coordonnées, votre photo et votre CV.
      </p>
      <div className="mt-6">
        <ProfileForm profile={(data as Profile) ?? null} />
      </div>
    </div>
  );
}
