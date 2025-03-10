// import path from "path";
// import matter from "gray-matter";
// import { log } from "./log";

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  snippet?: string;
  // content: string;
}


// export async function getPosts() {
//   const posts: Post[] = await fetch(`/api/posts`).then(x => x.json());
//   return { posts };
// }