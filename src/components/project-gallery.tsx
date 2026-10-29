"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import type { ProjectImage } from "@/lib/types";

export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const [active, setActive] = useState<ProjectImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(img)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted"
          >
            <Image
              src={img.image_url}
              alt={img.caption ?? ""}
              fill
              sizes="(max-width: 640px) 50vw, 300px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-md p-2 text-white/80 hover:text-white"
            onClick={() => setActive(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.image_url}
              alt={active.caption ?? ""}
              width={1200}
              height={800}
              className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
            />
            {active.caption && (
              <p className="mt-2 text-center text-sm text-white/80">{active.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
