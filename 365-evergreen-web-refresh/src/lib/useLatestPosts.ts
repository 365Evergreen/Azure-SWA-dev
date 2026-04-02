import { useQuery } from '@tanstack/react-query';

export interface LatestPost {
  type: string;
  excerpt: any;
  id: string;
  title: string;
  date: string;
  slug: string;
  content?: string;
  featuredImage?: { node: { sourceUrl: string } };
  categories?: { edges: { node: { id: string; name: string; slug: string } }[] };
}



// Hardcoded blob URL for hero and future components
export const COMPONENTS_BLOB_URL = 'https://365evergreendev.blob.core.windows.net/365-evergreen/components/page-components.json';

export function useLatestPosts(limit: number = 100, enabled: boolean = true): LatestPost[] {
  const { data } = useQuery({
    queryKey: ['latestPosts', limit],
    queryFn: () => prefetchLatestPosts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
  return data ?? [];
}

let latestPostsCache: LatestPost[] | null = null;
let latestPostsPromise: Promise<LatestPost[]> | null = null;

export function prefetchLatestPosts(limit: number = 100): Promise<LatestPost[]> {
  if (latestPostsCache) return Promise.resolve(latestPostsCache);
  if (latestPostsPromise) return latestPostsPromise;

  latestPostsPromise = fetch('https://365evergreendev.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query allPosts {\n  posts(first: ${limit}, where: {orderby: {field: DATE, order: DESC}}) {\n    edges {\n      node {\n        id\n        title\n        date\n        excerpt\n        featuredImage { node { sourceUrl } }\n        slug\n        categories { edges { node { id name slug } } }\n      }\n    }\n  }\n}`
    })
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    })
    .then(data => {
      const posts: LatestPost[] = data?.data?.posts?.edges?.map((e: any) => e.node) || [];
      latestPostsCache = posts;
      latestPostsPromise = null;
      return posts;
    })
    .catch(err => {
      latestPostsPromise = null;
      console.error('Failed to fetch posts from WPGraphQL:', err);
      throw err;
    });

  return latestPostsPromise;
}

