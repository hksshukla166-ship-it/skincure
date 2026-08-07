"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";

export function HomeCTASection() {
  const { tr } = useLanguage();

  return (
    <section className="section-padding bg-primary-900 text-white text-center">
      <AnimatedSection>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{tr("cta.title")}</h2>
        <p className="text-primary-200 mb-8 max-w-xl mx-auto">{tr("cta.subtitle")}</p>
        <Link href="/appointment" className="btn-gold">{tr("cta.button")}</Link>
      </AnimatedSection>
    </section>
  );
}

export function HomeAppointmentHeader() {
  const { tr } = useLanguage();

  return (
    <AnimatedSection className="text-center mb-12">
      <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">{tr("appointment.bookNow")}</span>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2">{tr("appointment.scheduleTitle")}</h2>
    </AnimatedSection>
  );
}
