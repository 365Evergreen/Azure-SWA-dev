import { useEffect, useState } from 'react';
import type { PageBlock } from './usePageBlocks';

export interface CtaPostData {
  id: string;
  title: string;
  blocks?: PageBlock[];
  content?: string;
  featuredImage?: { node: { sourceUrl: string } };
}

export function useCtaPost(slug: string | undefined): CtaPostData | null {
  const [data, setData] = useState<CtaPostData | null>(null);
  useEffect(() => {
    if (!slug) return;

    // Normalize to a URI that WP expects, e.g. '/cta/get-your-free-trial/'
    const uri = `/${slug.replace(/^\/+|\/+$/g, '')}/`;
    const slugOnly = `${slug.replace(/^\/+|\/+$/g, '')}`;

    // Attempt cTA by slug first, and fall back to post by URI in one request
    const query = `query GetCtaPost {\n  cTA(id: \"${slugOnly}\", idType: URI) {\n    title\n    slug\n    blocks\n    content(format: RENDERED)\n    featuredImage { node { sourceUrl } }\n  }\n  post(id: \"${uri}\", idType: URI) {\n    title\n    slug\n    blocks\n    content(format: RENDERED)\n    featuredImage { node { sourceUrl } }\n  }\n}`;

    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(result => {
        // Prefer cTA response; fallback to post
        const dataObj = result?.data?.cTA || result?.data?.post;
        if (!dataObj) {
          setData(null);
          return;
        }

        // Parse blocks if present (Gutenberg blocks stored as JSON string)
        let blocks: PageBlock[] = [];
        try {
          blocks = dataObj.blocks ? JSON.parse(dataObj.blocks) : [];
        } catch (e) {
          blocks = [];
        }

        setData({
          id: dataObj.slug,
          title: dataObj.title,
          blocks: blocks.length ? blocks : undefined,
          content: dataObj.content || undefined,
          featuredImage: dataObj.featuredImage,
        });
      })
      .catch(err => {
        console.error('Error fetching CTA post:', err);
        setData(null);
      });
  }, [slug]);
  return data;
}