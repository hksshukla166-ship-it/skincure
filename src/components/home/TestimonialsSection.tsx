"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { tr } = useLanguage();

  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">{tr("testimonials.label")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2 mb-4">{tr("testimonials.title")}</h2>
          <p className="text-primary-600 max-w-2xl mx-auto text-lg">{tr("testimonials.subtitle")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 0.1}>
              <GlassCard className="h-full relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-gold-200" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-primary-700 mb-6 leading-relaxed italic">&ldquo;{testimonial.review}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto">
                  {testimonial.photo_url ? (
                    <Image src={testimonial.photo_url} alt={testimonial.patient_name} width={48} height={48} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold">
                      {testimonial.patient_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-primary-900">{testimonial.patient_name}</p>
                    {testimonial.city && <p className="text-sm text-primary-500">{testimonial.city}</p>}
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
