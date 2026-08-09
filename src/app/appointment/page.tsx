import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Book your dermatology appointment at SKIN CURE clinic Bilaspur. Choose morning or evening slot online.",
};

export default async function AppointmentPage() {
  const settings = await getSettings();

  return (
    <>
      <Navbar settings={settings} />
      <main className="pt-24 min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <section className="section-padding">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-12">
              <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">Appointment</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2 mb-4">
                Book Your Consultation
              </h1>
              <p className="text-primary-600 max-w-xl mx-auto">
                Select your preferred date and choose Morning or Evening. Confirmation via WhatsApp.
              </p>
            </AnimatedSection>
            <AppointmentForm settings={settings} />
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      <StickyButtons settings={settings} />
    </>
  );
}
