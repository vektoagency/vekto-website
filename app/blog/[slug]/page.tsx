import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Men's Care`,
    description: post.metaDescription,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/blog"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            &larr; Всички статии
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 leading-tight">
          {post.title}
        </h1>

        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="text-sm text-accent hover:underline"
          >
            &larr; Обратно към блога
          </Link>
        </div>
      </main>
    </div>
  );
}
