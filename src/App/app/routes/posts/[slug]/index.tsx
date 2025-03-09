
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

import { getPost } from "~/utils/posts";
import type { Route } from "./+types";
import { MarkdownView } from "~/components/markdown-view";

const normalizePath = (pth: string | undefined) => {
  const slugs = pth?.split(/[/\\]/) || [];

  return "/" + slugs.filter(Boolean).join("/");
};


export async function loader({ params }: Route.LoaderArgs) {
  const fullSlug = normalizePath(params.slug);

  const post = await getPost(fullSlug);

  if (!post)
  {
    throw new Error("Not found");
  }

  return { post }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  return (
    <>
      {/* <Head>
        <title>{post.title}</title>
      </Head> */}
      <main className="py-8 mx-auto">
        <h1 className="text-5xl font-bold">{post.title}</h1>        
        <time className="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <hr/>
        <MarkdownView document={post.content} />
        {/* <Prose>
          <div
            className="m-8 markdown-body"
            dangerouslySetInnerHTML={{ __html: render(post.content) }}
          />
        </Prose> */}
      </main>
    </>
  );
}
