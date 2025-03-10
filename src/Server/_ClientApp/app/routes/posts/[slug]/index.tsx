// export const handler: Handlers<Post> = {
//   async GET(_req, ctx) {
//     try {
//       const post = await getPost(ctx.params.slug);
//       return ctx.render(post as Post);
//     } catch {
//       return ctx.renderNotFound();
//     }
//   },
// };

// import { getPost } from "~/utils/posts";
import type { Post } from "~/utils/posts";
import type { Route } from "./+types";
import { MarkdownView } from "~/components/markdown-view";
import { Container } from "~/components/Container";
import { HR } from "~/components/HR";

const normalizePath = (pth: string | undefined) => {
  const slugs = pth?.split(/[/\\]/) || [];

  return "/" + slugs.filter(Boolean).join("/");
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const post: Post & { content: string } = await fetch(
    `/api/posts/${params.slug}`
  ).then((x) => x.json());
  return { post };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leak | Leaky Cerebrum" },
    { name: "description", content: "Read a brain leak." },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  return (
    <Container>
      {/* <Head>
        <title>{post.title}</title>
      </Head> */}
      <article className="mx-auto">
        <h1 className="text-5xl font-bold">{post.title}</h1>
        <time className="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <HR/>
        <MarkdownView document={post.content} />
        {/* <Prose>
          <div
            className="m-8 markdown-body"
            dangerouslySetInnerHTML={{ __html: render(post.content) }}
          />
        </Prose> */}
      </article>
    </Container>
  );
}
