import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import ContactForm from "@/components/contact/ContactForm";
import { MapPin, Phone, Clock, MessageCircle, Navigation } from "lucide-react";
import { getSettings } from "@/lib/data";
import { getWhatsAppUrl, getCallUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact SKIN CURE dermatology clinic in Bilaspur. Phone, WhatsApp, directions and contact form.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsapp = settings?.whatsapp_number || "917828093301";
  const phone = settings?.phone || "07828093301";
  const mapsEmbed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED || settings?.google_maps_link;

  return (
    <>
      <Navbar settings={settings} />
      <main className="pt-24">
        <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-16">
              <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">Contact</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2">Get In Touch</h1>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12">
              <AnimatedSection>
                <div className="space-y-6">
                  <GlassCard hover={false}>
                    <MapPin className="w-6 h-6 text-gold-600 mb-3" />
                    <h3 className="font-semibold text-primary-900 mb-2">Address</h3>
                    <p className="text-primary-700">{settings?.address}</p>
                    {mapsEmbed && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.address || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-800 font-medium"
                      >
                        <Navigation className="w-4 h-4" /> Get Directions
                      </a>
                    )}
                  </GlassCard>

                  <GlassCard hover={false}>
                    <Phone className="w-6 h-6 text-gold-600 mb-3" />
                    <h3 className="font-semibold text-primary-900 mb-2">Phone</h3>
                    <a href={getCallUrl(phone)} className="text-primary-700 hover:text-primary-900 text-lg">{phone}</a>
                  </GlassCard>

                  <GlassCard hover={false}>
                    <Clock className="w-6 h-6 text-gold-600 mb-3" />
                    <h3 className="font-semibold text-primary-900 mb-2">Clinic Hours</h3>
                    <p className="text-primary-700">{settings?.opening_hours}</p>
                  </GlassCard>

                  <a
                    href={getWhatsAppUrl(whatsapp, "Hello Skin Cure, I have a query.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <GlassCard className="bg-green-50 border-green-200">
                      <MessageCircle className="w-6 h-6 text-green-600 mb-3" />
                      <h3 className="font-semibold text-primary-900 mb-2">WhatsApp</h3>
                      <p className="text-green-700">Chat with us instantly</p>
                    </GlassCard>
                  </a>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <ContactForm />
              </AnimatedSection>
            </div>

            {mapsEmbed && (
              <AnimatedSection className="mt-16">
                <div className="rounded-2xl overflow-hidden shadow-premium aspect-video">
                  <iframe
                    src={mapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SKIN CURE Clinic Location"
                  />
                </div>
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
