import type { Post } from "~/utils/posts";
import { MarkdownView } from "../markdown-view";

export function PostCard(props: { post: Post }) {
    const { post } = props;
    return (
      <a
        className="relative p-4 dark:bg-zinc-800/50 light:bg-zinc-200/50 rounded-md w-full"
        href={`/${post.slug}`}
      >
        <h3 className="text-lg sm:text-2xl">{post.title}</h3>
        <button className="absolute right-0 top-0 m-4 p-2 i-carbon-fit-to-screen text-zinc-500"></button>
        <span className="text-gray-500 text-xs sm:text-md">
        <time >
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        </span>
        {/* {post.snippet && <MarkdownView document={post.snippet} />} */}
      </a>
    );
  }
  