import fs from "fs";
import path from "path";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "menscare-blog");

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  content: string;
}

function fileToSlug(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/^\d+-/, "")
    .replace(/\s+/g, "-");
}

function getPostFromFile(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  const lines = raw.split("\n");

  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^#\s+/, "") : filename;

  const metaLine = lines.find((l) => l.startsWith("**Meta описание:**"));
  const metaDescription = metaLine
    ? metaLine.replace(/\*\*Meta описание:\*\*\s*/, "")
    : "";

  // Build body: skip title, meta line, and the first --- separator
  const bodyLines = lines.filter((l) => l !== titleLine && l !== metaLine);
  const firstSep = bodyLines.findIndex((l) => l.trim() === "---");
  const body =
    firstSep >= 0
      ? bodyLines.slice(firstSep + 1).join("\n")
      : bodyLines.join("\n");

  // Strip the trailing CTA block after the last ---
  const lastSep = body.lastIndexOf("\n---\n");
  const cleanBody = lastSep >= 0 ? body.slice(0, lastSep) : body;

  const content = marked(cleanBody.trim()) as string;

  return { slug: fileToSlug(filename), title, metaDescription, content };
}

export function getAllPosts(): BlogPost[] {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
  return files.map(getPostFromFile);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"));
  const file = files.find((f) => fileToSlug(f) === slug);
  if (!file) return undefined;
  return getPostFromFile(file);
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(fileToSlug);
}
