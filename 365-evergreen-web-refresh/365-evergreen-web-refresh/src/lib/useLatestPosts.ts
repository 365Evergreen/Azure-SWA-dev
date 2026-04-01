import { useEffect, useState } from 'react';

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

export function useLatestPosts(limit: number = 100): LatestPost[] {
  const [posts, setPosts] = useState<LatestPost[]>([]);
  useEffect(() => {
    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query allPosts {\n  posts(first: ${limit}, where: {orderby: {field: DATE, order: DESC}}) {\n    edges {\n      node {\n        id\n        title\n        date\n        excerpt\n        content(format: RENDERED)\n        featuredImage { node { sourceUrl } }\n        slug\n        categories { edges { node { id name slug } } }\n      }\n    }\n  }\n}`
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then(data => {
        setPosts(data?.data?.posts?.edges?.map((e: any) => e.node) || []);
      })
      .catch(err => {
         
        console.error('Failed to fetch posts from WPGraphQL:', err);
        setPosts([]);
      });
  }, [limit]);
  return posts;
}

