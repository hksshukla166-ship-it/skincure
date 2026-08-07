import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyButtons } from "@/components/layout/StickyButtons";
import { getSettings, getBlogBySlug } from "@/lib/data";
import { sanitizeHtml } from "@/lib/sanitize";
import { ArrowLeft, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt || undefined,
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt || undefined,
      images: blog.cover_image_url ? [blog.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [settings, blog] = await Promise.all([getSettings(), getBlogBySlug(slug)]);

  if (!blog) notFound();

  return (
    <>
      <Navbar settings={settings} />
      <main className="pt-24">
        <article className="section-padding">
          <div className="container-custom max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            {blog.cover_image_url && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-premium">
                <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover" priority />
              </div>
            )}

            <div className="flex items-center gap-2 text-primary-500 mb-4">
              <Calendar className="w-4 h-4" />
              {blog.published_at ? new Date(blog.published_at).toLocaleDateString("en-IN", { dateStyle: "long" }) : ""}
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mb-8">{blog.title}</h1>

            <div
              className="prose prose-lg prose-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content.replace(/\n/g, "<br />")) }}
            />
          </div>
        </article>
      </main>
      <Footer settings={settings} />
      <StickyButtons settings={settings} />
    </>
  );
}
