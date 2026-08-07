import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HomeAppointmentHeader, HomeCTASection } from "@/components/home/HomeSections";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";
import { getSettings, getDoctor, getServices, getGallery, getTestimonials, incrementVisitorCount } from "@/lib/data";

export default async function HomePage() {
  const [settings, doctor, services, gallery, testimonials] = await Promise.all([
    getSettings(),
    getDoctor(),
    getServices(),
    getGallery(),
    getTestimonials(),
  ]);

  try {
    await incrementVisitorCount();
  } catch {
    // Non-critical
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: settings?.clinic_name || "SKIN CURE",
    description: "Premium dermatology clinic in Bilaspur",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    telephone: settings?.phone || "07828093301",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address,
      addressLocality: "Bilaspur",
      addressRegion: "Chhattisgarh",
      postalCode: "495001",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings?.google_rating || 5.0,
      reviewCount: settings?.google_reviews_count || 155,
    },
    openingHours: "Mo-Su 09:00-19:00",
    medicalSpecialty: "Dermatology",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar settings={settings} />
      <main>
        <HeroSection settings={settings} doctor={doctor} />
        <ServicesSection services={services} />
        <GallerySection items={gallery} />
        <TestimonialsSection testimonials={testimonials} />

        <section className="section-padding bg-gradient-to-b from-white to-primary-50" id="appointment">
          <div className="container-custom">
            <HomeAppointmentHeader />
            <AppointmentForm settings={settings} />
          </div>
        </section>

        <HomeCTASection />
      </main>
      <Footer settings={settings} />
      <StickyButtons settings={settings} />
    </>
  );
}
