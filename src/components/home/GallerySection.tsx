"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import type { GalleryItem } from "@/types";

interface GallerySectionProps {
  items: GalleryItem[];
}

export function GallerySection({ items }: GallerySectionProps) {
  const { tr } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : null));

  if (items.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">{tr("gallery.label")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2 mb-4">{tr("gallery.title")}</h2>
          <p className="text-primary-600 max-w-2xl mx-auto text-lg">{tr("gallery.subtitle")}</p>
        </AnimatedSection>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.slice(0, 6).map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <div className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer group" onClick={() => openLightbox(index)}>
                {item.media_type === "video" ? (
                  <div className="relative aspect-video bg-primary-900">
                    <video src={item.media_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[4/3]">
                    <Image src={item.media_url} alt={item.title || "Gallery image"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                )}
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white font-medium">{item.title}</p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-12">
          <Link href="/gallery" className="btn-outline">{tr("gallery.viewFull")}</Link>
        </AnimatedSection>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && items[lightboxIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
            <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={closeLightbox} aria-label="Close"><X className="w-8 h-8" /></button>
            <button className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous"><ChevronLeft className="w-8 h-8" /></button>
            <button className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next"><ChevronRight className="w-8 h-8" /></button>
            <div className="max-w-5xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
              {items[lightboxIndex].media_type === "video" ? (
                <video src={items[lightboxIndex].media_url} controls autoPlay className="max-h-[85vh] rounded-lg" />
              ) : (
                <Image src={items[lightboxIndex].media_url} alt={items[lightboxIndex].title || "Gallery"} width={1200} height={800} className="max-h-[85vh] w-auto object-contain rounded-lg" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
