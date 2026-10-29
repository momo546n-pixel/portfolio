import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  initials,
  alt,
  size = 112,
  className,
}: {
  src?: string | null;
  initials: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-brand font-semibold text-white ring-2 ring-brand/60 select-none",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? initials}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
