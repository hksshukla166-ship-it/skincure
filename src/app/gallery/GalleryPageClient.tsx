"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { GalleryItem, Settings } from "@/types";

interface GalleryPageClientProps {
  items: GalleryItem[];
  settings: Settings | null;
}

const categories = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "before_after", label: "Before & After" },
  { value: "clinic", label: "Clinic" },
  { value: "treatment", label: "Treatment" },
];

export default function GalleryPageClient({ items, settings }: GalleryPageClientProps) {
  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      <Navbar settings={settings} />
      <main className="pt-24">
        <section className="section-padding">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mb-4">Gallery</h1>
              <p className="text-primary-600">Explore our clinic, treatments, and patient results</p>
            </AnimatedSection>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-5 py-2 rounded-full font-medium transition-all ${
                    filter === cat.value
                      ? "bg-primary-800 text-white shadow-premium"
                      : "glass text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-primary-600 py-12">No gallery items yet. Admin can upload via dashboard.</p>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {filtered.map((item, index) => (
                  <AnimatedSection key={item.id} delay={index * 0.05}>
                    <div
                      className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer group"
                      onClick={() => setLightboxIndex(filtered.indexOf(item))}
                    >
                      {item.media_type === "video" ? (
                        <div className="relative aspect-video bg-primary-900">
                          <video src={item.media_url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-[4/3]">
                          <Image src={item.media_url} alt={item.title || "Gallery"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      <StickyButtons settings={settings} />

      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
            <button className="absolute top-4 right-4 text-white p-2" onClick={() => setLightboxIndex(null)}><X className="w-8 h-8" /></button>
            <div className="max-w-5xl p-4" onClick={(e) => e.stopPropagation()}>
              {filtered[lightboxIndex].media_type === "video" ? (
                <video src={filtered[lightboxIndex].media_url} controls autoPlay className="max-h-[85vh] rounded-lg" />
              ) : (
                <Image src={filtered[lightboxIndex].media_url} alt="" width={1200} height={800} className="max-h-[85vh] w-auto object-contain rounded-lg" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
