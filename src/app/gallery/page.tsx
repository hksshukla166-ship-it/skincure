import { Metadata } from "next";
import { getSettings, getGallery } from "@/lib/data";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "View SKIN CURE clinic gallery - before/after results, clinic photos, and treatment videos.",
};

export default async function GalleryPage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGallery()]);
  return <GalleryPageClient items={gallery} settings={settings} />;
}
