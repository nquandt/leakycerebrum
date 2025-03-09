import path from "path";
import matter from "gray-matter";
import { log } from "./log";

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  snippet: string;
  content: string;
}

const fetcher = async (url: string) => {
  const finalUrl = `${process.env.API_URL || "http://localhost:7135"}${url}`;
  log({ finalUrl });
  return await fetch(finalUrl);
};

const getJson = async <T>(url: string) => {
  if (!url.startsWith("/")) {
    throw new Error("url must start with /");
  }

  const resp = await fetcher(url);
  const json = await resp.json();

  return json as T;
};

const getRaw = async (url: string) => {
  if (!url.startsWith("/")) {
    throw new Error("url must start with /");
  }

  const resp = await fetcher(url);
  const text = await resp.text();

  return text;
};

// Get posts.
export async function getPosts(): Promise<Post[]> {
  // const rootDir = getAppDirectory();
  // const files = await readdir(path.join(rootDir, DIRECTORY));

  const files = await getJson<string[]>("/api/posts");

  // const files = Deno.readDir(DIRECTORY);
  const promises = [];
  for (const file of files) {
    const name = file.split("/").pop();
    if (!name) {
      continue;
    }
    const slug = name.replace(".md", "");
    promises.push(getPost(slug));
  }
  const posts = (await Promise.all(promises)) as Post[];
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return posts;
}

// Get post.
export async function getPost(slug: string): Promise<Post | null> {
  const text = await getRaw(path.join("/api/posts", slug).replace(/\\/g, "/"));
  const { content, data } = matter(text);
  // const { attrs, body } = extract(text);
  const { title, snippet, published_at } = data;
  return {
    slug,
    title: title,
    publishedAt: new Date(published_at),
    content,
    snippet: snippet,
  };
}
