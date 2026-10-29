import { ProjectForm } from "@/components/admin/project-form";

export default function NouveauProjetPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Nouveau projet</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Créez un projet, ou pré-remplissez-le automatiquement depuis un dépôt GitHub.
      </p>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
