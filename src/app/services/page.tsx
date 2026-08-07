import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { getSettings, getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Comprehensive dermatology services at SKIN CURE - skin treatment, hair care, laser procedures, chemical peel and more.",
};

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <>
      <Navbar settings={settings} />
      <main className="pt-24">
        <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-700 text-white text-center">
          <AnimatedSection>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-primary-200 max-w-2xl mx-auto text-lg">
              Comprehensive dermatology treatments tailored to your unique needs
            </p>
          </AnimatedSection>
        </section>
        <ServicesSection services={services} />
        <section className="section-padding text-center">
          <Link href="/appointment" className="btn-gold">Book Consultation</Link>
        </section>
      </main>
      <Footer settings={settings} />
      <StickyButtons settings={settings} />
    </>
  );
}
