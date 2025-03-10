import { useGetPosts } from "~/hooks/useGetPosts";
import { PostCard } from "../PostCard";

export const Posts = () => {
  const posts = useGetPosts();
  if (!posts)
  {
    return <></>
  }
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.title} post={post} />
      ))}
    </>
  );
};
