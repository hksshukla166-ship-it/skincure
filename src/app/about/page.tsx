import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import Image from "next/image";
import { Award, GraduationCap, Clock, Star } from "lucide-react";
import { getSettings, getDoctor, getFAQ } from "@/lib/data";
import FAQAccordion from "@/components/about/FAQAccordion";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about SKIN CURE clinic and Dr. Ajay Pandey - Bilaspur's trusted dermatologist with 15+ years experience.",
};

export default async function AboutPage() {
  const [settings, doctor, faqs] = await Promise.all([
    getSettings(),
    getDoctor(),
    getFAQ(),
  ]);

  return (
    <>
      <Navbar settings={settings} />
      <main className="pt-24">
        <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-16">
              <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">About Us</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2">
                Our Story & Mission
              </h1>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <AnimatedSection>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                  {doctor?.image_url ? (
                    <Image src={doctor.image_url} alt={doctor.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-5xl font-display font-bold">
                        AP
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <h2 className="font-display text-3xl font-bold text-primary-900 mb-4">{doctor?.name}</h2>
                <p className="text-gold-600 font-medium mb-6">{doctor?.specialization}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <GlassCard hover={false} className="p-4">
                    <GraduationCap className="w-6 h-6 text-primary-600 mb-2" />
                    <p className="text-sm text-primary-600">Qualification</p>
                    <p className="font-semibold text-primary-900">{doctor?.qualification}</p>
                  </GlassCard>
                  <GlassCard hover={false} className="p-4">
                    <Clock className="w-6 h-6 text-primary-600 mb-2" />
                    <p className="text-sm text-primary-600">Experience</p>
                    <p className="font-semibold text-primary-900">{doctor?.experience}</p>
                  </GlassCard>
                </div>

                <p className="text-primary-700 leading-relaxed mb-6">{doctor?.about}</p>

                {doctor?.awards && (doctor.awards as Array<{ title: string; year?: string }>).length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-gold-600" /> Awards
                    </h3>
                    <ul className="space-y-2">
                      {(doctor.awards as Array<{ title: string; year?: string }>).map((award, i) => (
                        <li key={i} className="text-primary-700 flex items-center gap-2">
                          <Star className="w-4 h-4 text-gold-500" />
                          {award.title} {award.year && `(${award.year})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AnimatedSection>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <AnimatedSection>
                <GlassCard className="text-center h-full">
                  <h3 className="font-display text-xl font-bold text-primary-900 mb-3">Our Mission</h3>
                  <p className="text-primary-600">To provide world-class dermatology care accessible to everyone in Bilaspur and surrounding areas.</p>
                </GlassCard>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <GlassCard className="text-center h-full">
                  <h3 className="font-display text-xl font-bold text-primary-900 mb-3">Our Vision</h3>
                  <p className="text-primary-600">To be the most trusted dermatology clinic in Chhattisgarh, known for excellence and patient care.</p>
                </GlassCard>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <GlassCard className="text-center h-full">
                  <h3 className="font-display text-xl font-bold text-primary-900 mb-3">Patient Care</h3>
                  <p className="text-primary-600">Personalized treatment plans, transparent communication, and compassionate care for every patient.</p>
                </GlassCard>
              </AnimatedSection>
            </div>

            {faqs.length > 0 && (
              <AnimatedSection>
                <h2 className="font-display text-3xl font-bold text-primary-900 text-center mb-8">Frequently Asked Questions</h2>
                <FAQAccordion faqs={faqs} />
              </AnimatedSection>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      <StickyButtons settings={settings} />
    </>
  );
}
