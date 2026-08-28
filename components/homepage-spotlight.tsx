import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CtaTrackLink } from "@/components/cta-track-link";
import { SponsoredBadge } from "@/components/sponsored-badge";
import type { ResolvedHomepageSpotlight } from "@/lib/types";

export function HomepageSpotlight({ spotlight }: { spotlight: ResolvedHomepageSpotlight }) {
  const isExternal = spotlight.link_type === "external";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:flex-row">
        <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-80">
          <Image
            src={spotlight.image.storage_path}
            alt={spotlight.image.alt_text ?? spotlight.title}
            fill
            sizes="(min-width: 640px) 320px, 100vw"
            className="object-cover"
          />
          {spotlight.is_sponsored && (
            <SponsoredBadge className="absolute left-3 top-3" />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 p-6">
          <h2 className="text-xl font-semibold text-foreground">{spotlight.title}</h2>
          <p className="text-sm text-muted-foreground">{spotlight.body_text}</p>
          <CtaTrackLink
            href={spotlight.href}
            entityType="homepage_spotlight"
            entityId={spotlight.id}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? (spotlight.is_sponsored ? "noopener sponsored" : "noopener noreferrer") : undefined}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Entdecken
            <ArrowRight className="size-4" aria-hidden />
          </CtaTrackLink>
        </div>
      </div>
    </section>
  );
}
