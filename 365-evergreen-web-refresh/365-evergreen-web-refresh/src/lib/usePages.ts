import { useEffect, useState } from 'react';

export interface PageNode {
  id: string;
  title: string;
  uri: string;
  slug: string;
  content?: string;
  featuredImage?: { node?: { sourceUrl?: string } };
}

export function usePages(): PageNode[] {
  const [pages, setPages] = useState<PageNode[]>([]);
  useEffect(() => {
    const query = `query pages {\n  pages {\n    edges {\n      node {\n        id\n        title\n        uri\n        slug\n        editorBlocks { renderedHtml }\n        content(format: RENDERED)\n        featuredImage { node { sourceUrl } }\n      }\n    }\n  }\n}`;
    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(res => res.json())
      .then(result => {
        console.debug('usePages - result', result);
        const nodes: PageNode[] = result?.data?.pages?.edges?.map((e: { node: PageNode }) => e.node) || [];
        setPages(nodes);
      })
      .catch(err => {
        console.error('Failed to fetch pages from WPGraphQL:', err);
        setPages([]);
      });
  }, []);
  return pages;
}
