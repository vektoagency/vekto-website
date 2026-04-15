import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Блог — Men's Care",
  description:
    "Научи всичко за растежа на брадата — миноксидил, дермаролер, масло за брада и още.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            &larr; Начало
          </Link>
          <span className="text-sm font-semibold tracking-wide text-foreground">БЛОГ</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Блог</h1>
        <p className="text-muted mb-12 max-w-2xl">
          Полезни статии за растежа и поддръжката на брадата — доказани методи,
          ръководства и съвети от практиката.
        </p>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border border-border rounded-xl p-6 hover:border-accent/40 transition-colors bg-card"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed line-clamp-2">
                {post.metaDescription}
              </p>
              <span className="inline-block mt-4 text-xs text-accent font-medium">
                Прочети &rarr;
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
