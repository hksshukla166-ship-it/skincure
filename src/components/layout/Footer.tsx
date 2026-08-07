import Link from "next/link";
import { Phone, MapPin, Clock, Star, Heart } from "lucide-react";
import type { Settings } from "@/types";

interface FooterProps {
  settings: Settings | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4 text-gold-400">
              {settings?.clinic_name || "SKIN CURE"}
            </h3>
            <p className="text-primary-200 mb-4 leading-relaxed">
              Premium dermatology clinic providing expert skin, hair, and nail care in Bilaspur, Chhattisgarh.
            </p>
            <div className="flex items-center gap-2 text-gold-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">{settings?.google_rating || 5.0}</span>
              <span className="text-primary-300">({settings?.google_reviews_count || 155}+ Reviews)</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-400">Services</h4>
            <ul className="space-y-2 text-primary-200">
              <li><Link href="/services" className="hover:text-white transition-colors">Skin Treatment</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Hair Care</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Laser Procedures</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Chemical Peel</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">View All Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-400">Quick Links</h4>
            <ul className="space-y-2 text-primary-200">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/appointment" className="hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-400">Contact</h4>
            <ul className="space-y-3 text-primary-200">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <span>{settings?.address || "Skin Cure Link Road Narayan Plaza Agrasen Chowk Telipara Bilaspur Chhattisgarh 495001"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <a href={`tel:${settings?.phone || "07828093301"}`} className="hover:text-white transition-colors">
                  {settings?.phone || "07828093301"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                <span>{settings?.opening_hours || "Open Daily · Closes at 7 PM"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-300 text-sm">
            © {currentYear} {settings?.clinic_name || "SKIN CURE"}. All rights reserved.
          </p>
          <p className="text-primary-300 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-current" /> by{" "}
            <span className="text-gold-400 font-medium">HKS Web Development Company</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
