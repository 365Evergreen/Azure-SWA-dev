import { useEffect, useState } from 'react';

const WP_GRAPHQL_ENDPOINT = 'https://365evergreendev.com/graphql';

export interface AccordionPost {
  id: string;
  title: string;
  content: string;
  slug: string;
}

export function useAccordionItemBySlug(slug: string | undefined): AccordionPost | null {
  const [data, setData] = useState<AccordionPost | null>(null);
  useEffect(() => {
    if (!slug) return;
    const clean = slug.replace(/^\/+|\/+$/g, '');
    const uri = `/accordion-item/${clean}/`;
    fetch(WP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query AccordionItemByUri {
  nodeByUri(uri: "${uri}") {
    id
    ... on Post { title content slug }
    ... on Page { title content slug }
    ... on AccordionItem { title content slug }
  }
}`
      })
    })
      .then(res => res.json())
      .then(result => {
        const node = result?.data?.nodeByUri;
        if (!node) {
          setData(null);
          return;
        }
        // node may contain title and content or other shapes
        const title = node.title ?? '';
        const content = node.content ?? '';
        const slugVal = clean;
        setData({ id: node.id ?? slugVal, title, content, slug: slugVal });
      })
      .catch(() => setData(null));
  }, [slug]);
  return data;
}
