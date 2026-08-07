"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, Award, Clock, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { getWhatsAppUrl, getCallUrl } from "@/lib/utils";
import Hero3D from "@/components/3d/Hero3D";
import type { Settings, Doctor } from "@/types";

interface HeroSectionProps {
  settings: Settings | null;
  doctor: Doctor | null;
}

export function HeroSection({ settings, doctor }: HeroSectionProps) {
  const { tr } = useLanguage();
  const whatsapp = settings?.whatsapp_number || "917828093301";
  const phone = settings?.phone || "07828093301";
  const doctorName = doctor?.name || "Dr. Ajay Pandey";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
      <Hero3D />

      <div className="container-custom relative z-10 pt-32 pb-20 px-4 md:px-8">
        <div className="flex justify-end mb-6 lg:hidden">
          <LanguageSwitcher variant="hero" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                <Star className="w-4 h-4 text-gold-500 fill-current" />
                <span className="text-sm font-medium text-primary-800">
                  {settings?.google_rating || 5.0} {tr("hero.rating")} · {settings?.google_reviews_count || 155}+ {tr("hero.reviews")}
                </span>
              </div>
              <div className="hidden lg:block">
                <LanguageSwitcher variant="hero" />
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">{tr("hero.premium")}</span>
              <br />
              <span className="text-primary-900">{tr("hero.skinCare")}</span>
              <br />
              <span className="text-gold-600">{tr("hero.youDeserve")}</span>
            </h1>

            <p className="text-lg text-primary-700 mb-8 max-w-lg leading-relaxed">
              {tr("hero.subtitle", { doctor: doctorName })}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/appointment">
                <Button variant="gold" size="lg">{tr("hero.bookAppointment")}</Button>
              </Link>
              <a href={getCallUrl(phone)}>
                <Button variant="outline" size="lg">
                  <Phone className="w-5 h-5" />
                  {tr("hero.callNow")}
                </Button>
              </a>
              <a href={getWhatsAppUrl(whatsapp, "Hello Skin Cure, I need consultation.")} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg">
                  <MessageCircle className="w-5 h-5" />
                  {tr("hero.whatsapp")}
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-primary-900">{settings?.patient_counter || 5000}+</p>
                  <p className="text-sm text-primary-600">{tr("hero.happyPatients")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-gold-700" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-primary-900">{doctor?.experience || "15+ Years"}</p>
                  <p className="text-sm text-primary-600">{tr("hero.experience")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <p className="font-bold text-lg text-primary-900">{settings?.opening_hours || "Open Daily"}</p>
                  <p className="text-sm text-primary-600">{tr("hero.clinicHours")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-400/20 to-transparent rounded-bl-full" />

              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-primary-100 to-primary-200">
                {doctor?.image_url ? (
                  <Image src={doctor.image_url} alt={doctor.name} fill className="object-cover" priority />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-4xl font-display font-bold mb-4">
                        AP
                      </div>
                      <p className="text-primary-600 text-sm">{tr("hero.uploadPhotoHint")}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="font-display text-2xl font-bold text-primary-900">{doctorName}</h3>
                <p className="text-gold-600 font-medium">{doctor?.specialization || "Dermatology / Skin Clinic"}</p>
                <p className="text-primary-600 mt-2">{doctor?.qualification || "MBBS, MD (Dermatology)"}</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
