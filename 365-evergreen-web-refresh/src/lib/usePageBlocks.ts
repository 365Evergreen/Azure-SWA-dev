import { useEffect, useState } from 'react';

export interface PageBlock {
  name: string;
  attributes: Record<string, unknown>;
  innerHTML?: string;
  innerBlocks?: PageBlock[];
}

export interface PageData {
  id: string;
  title: string;
  blocks: PageBlock[];
}

export function usePageBlocks(
  idOrSlug: string,
  nodeType: 'page' | 'post' = 'page'
): PageData | null {
  const [data, setData] = useState<PageData | null>(null);
  useEffect(() => {
    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetNode {\n  ${nodeType}(id: "${idOrSlug}") {\n    id\n    title\n    blocks\n  }\n}`
      })
    })
      .then(res => res.json())
      .then(result => {
        const node = result?.data?.[nodeType];
        let blocks: PageBlock[] = [];
        try {
          blocks = node?.blocks ? JSON.parse(node.blocks) : [];
        } catch {
          blocks = [];
        }
        setData({ id: node?.id, title: node?.title, blocks });
      });
  }, [idOrSlug, nodeType]);
  return data;
}
