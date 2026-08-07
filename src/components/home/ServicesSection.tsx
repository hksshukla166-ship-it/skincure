"use client";

import * as Icons from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import type { Service } from "@/types";

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const { tr } = useLanguage();

  const getIcon = (iconName: string) => {
    const key = iconName
      .split("-")
      .map((s, i) => (i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1)))
      .join("");
    const icons = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[key] || Icons.Sparkles;
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary-50">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">{tr("services.label")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2 mb-4">
            {tr("services.title")}
          </h2>
          <p className="text-primary-600 max-w-2xl mx-auto text-lg">{tr("services.subtitle")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <AnimatedSection key={service.id} delay={index * 0.05}>
                <GlassCard className="h-full group cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-primary-900 mb-2">{service.title}</h3>
                  <p className="text-primary-600 text-sm leading-relaxed">{service.description}</p>
                </GlassCard>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection className="text-center mt-12">
          <Link href="/services" className="btn-outline">{tr("services.viewAll")}</Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
