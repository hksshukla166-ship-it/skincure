"use client";

import { MapPin, Navigation } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { getGoogleMapsEmbedUrl, getGoogleMapsSearchUrl } from "@/lib/utils";
import type { Settings } from "@/types";

interface HomeMapSectionProps {
  settings: Settings | null;
  mapsEmbed?: string | null;
}

export function HomeMapSection({ settings, mapsEmbed }: HomeMapSectionProps) {
  const address =
    settings?.address ||
    "Skin Cure Link Road Narayan Plaza Agrasen Chowk Telipara Bilaspur Chhattisgarh 495001";

  const embedUrl = getGoogleMapsEmbedUrl(
    mapsEmbed || settings?.google_maps_link,
    address
  );
  const mapsUrl = getGoogleMapsSearchUrl(address);

  return (
    <section className="section-padding bg-gradient-to-b from-primary-50 to-white" id="location">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-10">
          <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">Find Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2">
            Visit SKIN CURE Clinic
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl overflow-hidden shadow-premium border border-primary-100 hover:shadow-xl transition-shadow"
            aria-label="Open SKIN CURE clinic location in Google Maps"
          >
            <div className="relative aspect-video min-h-[360px] bg-primary-100">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SKIN CURE Clinic Location"
              />

              <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/15 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-primary-900 font-semibold shadow-lg">
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </span>
              </div>
            </div>

            <div className="p-5 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3 text-left">
                <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <p className="text-primary-700">{address}</p>
              </div>
              <span className="inline-flex items-center justify-center gap-2 text-gold-700 font-semibold shrink-0">
                <Navigation className="w-4 h-4" />
                Open in Google Maps
              </span>
            </div>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
