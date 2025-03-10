import { useGetPosts } from "~/hooks/useGetPosts";
import { PostCard } from "../PostCard";

export const Posts = () => {
  const posts = useGetPosts();
  if (!posts)
  {
    return <></>
  }
  return (
    <div className="flex flex-col gap-8 w-full">
      {posts.map((post) => (
        <PostCard key={post.title} post={post} />
      ))}
    </div>
  );
};
