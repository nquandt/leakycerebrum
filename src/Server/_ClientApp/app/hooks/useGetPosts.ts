import useSWR from "swr";
import type { Post } from "~/utils/posts";

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const useGetPosts = () => {
    const { data, error, isLoading } = useSWR<Post[]>('/api/posts', fetcher)

    return data;
}