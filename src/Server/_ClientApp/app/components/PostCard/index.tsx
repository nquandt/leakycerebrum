import type { Post } from "~/utils/posts";
import { MarkdownView } from "../markdown-view";

export function PostCard(props: { post: Post }) {
    const { post } = props;
    return (
      <a
        className="py-4 px-8 dark:bg-zinc-800/50 light:bg-zinc-200/50 rounded-md w-full"
        href={`/${post.slug}`}
      >
        <h3 className="text-3xl font-bold">{post.title}</h3>
        <time className="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {post.snippet && <MarkdownView document={post.snippet} />}
      </a>
    );
  }
  