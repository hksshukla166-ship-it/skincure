"use client";

import Link from "next/link";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { getWhatsAppUrl, getCallUrl } from "@/lib/utils";
import type { Settings } from "@/types";

interface StickyButtonsProps {
  settings: Settings | null;
}

export function StickyButtons({ settings }: StickyButtonsProps) {
  const phone = settings?.phone || "07828093301";
  const whatsapp = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917828093301";

  const whatsappMessage = "Hello Skin Cure, I would like to inquire about your dermatology services.";
  const whatsappUrl = getWhatsAppUrl(whatsapp, whatsappMessage);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Link
        href="/appointment"
        className="w-14 h-14 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 text-white shadow-gold flex items-center justify-center hover:scale-110 transition-transform animate-float"
        aria-label="Book appointment"
      >
        <Calendar className="w-6 h-6" />
      </Link>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a
        href={getCallUrl(phone)}
        className="w-14 h-14 rounded-full bg-primary-800 text-white shadow-premium flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Call clinic"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
