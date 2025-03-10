import { getPosts, type Post } from "~/utils/posts";
import type { Route } from "./+types";
import { Prose } from "~/components/Prose";
import { MarkdownView } from "~/components/markdown-view";
import { Container } from "~/components/Container";
import { PostCard } from "~/components/PostCard";

// export async function loader({ params }: Route.LoaderArgs) {
//   const posts = await getPosts();
//   return { posts };
// }

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  return await getPosts();
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  return (
    <Container>
      {posts.map((post) => (
        <PostCard key={post.title} post={post} />
      ))}
    </Container>
  );
}
