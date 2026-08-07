import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar } from "lucide-react";
import { getSettings, getBlogs } from "@/lib/data";
import { truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dermatology tips, skin care advice, and health articles from SKIN CURE clinic.",
};

export default async function BlogPage() {
  const [settings, blogs] = await Promise.all([getSettings(), getBlogs()]);

  return (
    <>
      <Navbar settings={settings} />
      <main className="pt-24">
        <section className="section-padding">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-16">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mb-4">Health Blog</h1>
              <p className="text-primary-600">Expert insights on skin care and dermatology</p>
            </AnimatedSection>

            {blogs.length === 0 ? (
              <p className="text-center text-primary-600 py-12">No blog posts yet. Check back soon!</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <AnimatedSection key={blog.id} delay={index * 0.1}>
                    <Link href={`/blog/${blog.slug}`}>
                      <GlassCard className="h-full overflow-hidden p-0">
                        <div className="relative aspect-video bg-primary-100">
                          {blog.cover_image_url ? (
                            <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-primary-400">No image</div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-sm text-primary-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            {blog.published_at ? new Date(blog.published_at).toLocaleDateString("en-IN") : ""}
                          </div>
                          <h2 className="font-display text-xl font-bold text-primary-900 mb-2">{blog.title}</h2>
                          <p className="text-primary-600 text-sm">{truncate(blog.excerpt || blog.content, 120)}</p>
                        </div>
                      </GlassCard>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      <StickyButtons settings={settings} />
    </>
  );
}
