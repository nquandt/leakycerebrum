import { config } from "@/utils/config";

import ky from "ky";

const { blogCollectionName: collectionName, baseUrl } = config.directus;

const directus = ky.extend({ prefixUrl: baseUrl });

type DirectusData<T> = {
  data: T;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  date_created: string;
  snippet: string;
  content: string;
  tags?: string[];
};

export const getPost = async (postId: string) =>
  await directus
    .get(`items/${collectionName}/${postId}`)
    .json<DirectusData<Post>>()
    .then((x) => x.data);

export const getPosts = async () =>
  await directus
    .get(`items/${collectionName}`)
    .json<DirectusData<Post[]>>()
    .then((x) => x.data);
