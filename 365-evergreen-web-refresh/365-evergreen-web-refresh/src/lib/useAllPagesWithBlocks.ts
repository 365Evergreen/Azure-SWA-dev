import { useEffect, useState } from 'react';

export interface PageBlock {
  name: string;
  attributes: Record<string, any>;
  innerHTML?: string;
  innerBlocks?: PageBlock[];
  htmlContent?: string;
  dynamicContent?: string;
}

export interface PageNode {
  id: string;
  name: string;
  uri: string;
  slug: string;
  blocks: PageBlock[];
}

export function useAllPagesWithBlocks(): PageNode[] | null {
  const [pages, setPages] = useState<PageNode[] | null>(null);
  useEffect(() => {
    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query whatWeDo {\n  e365pages {\n    edges {\n      node {\n        id\n        title\n        uri\n        slug\n        blocks(attributes: true, dynamicContent: true, htmlContent: true)\n      }\n    }\n  }\n}`
      })
    })
      .then(res => res.json())
      .then(result => {
        const nodes = result?.data?.e365pages?.edges?.map((e: any) => {
          let blocks: PageBlock[] = [];
          try {
            blocks = e.node?.blocks ? JSON.parse(e.node.blocks) : [];
          } catch {
            blocks = [];
          }
          return { ...e.node, blocks };
        }) || [];
        setPages(nodes);
      });
  }, []);
  return pages;
}