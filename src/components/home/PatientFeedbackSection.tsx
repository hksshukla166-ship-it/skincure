"use client";

import { Play } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { FeedbackVideo } from "@/types";

interface PatientFeedbackSectionProps {
  videos: FeedbackVideo[];
}

export function PatientFeedbackSection({ videos }: PatientFeedbackSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold-600 font-semibold uppercase tracking-wider text-sm">Patient Stories</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mt-2 mb-4">Patient Feedback Videos</h2>
          <p className="text-primary-600 max-w-2xl mx-auto text-lg">
            Hear directly from our patients about their experience at SKIN CURE.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <AnimatedSection key={video.id} delay={index * 0.1}>
              <GlassCard className="overflow-hidden p-0">
                <div className="relative aspect-[9/16] bg-primary-900">
                  <video
                    src={video.video_url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    title={video.title || "Patient feedback"}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0">
                      <Play className="w-7 h-7 text-white fill-white" />
                    </div>
                  </div>
                </div>
                {video.title && (
                  <div className="p-4">
                    <p className="font-medium text-primary-900">{video.title}</p>
                  </div>
                )}
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
