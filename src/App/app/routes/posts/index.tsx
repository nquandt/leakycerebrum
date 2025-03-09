import { getPosts, type Post } from "~/utils/posts";
import type { Route } from "./+types";
import { Prose } from "~/components/Prose";
import { MarkdownView } from "~/components/markdown-view";

export async function loader({ params }: Route.LoaderArgs) {
  const posts = await getPosts();
  return { posts };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.title} post={post} />
      ))}
    </>
  );
}

function PostCard(props: { post: Post }) {
  const { post } = props;
  return (
    <a
      className="py-4 px-8 bg-zinc-800/50 rounded-md w-full"
      href={`/posts/${post.slug}`}
    >
      <h3 className="text-3xl font-bold">{post.title}</h3>
      <time className="text-gray-500">
        {new Date(post.publishedAt).toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <MarkdownView document={post.snippet} />
    </a>
  );
}
