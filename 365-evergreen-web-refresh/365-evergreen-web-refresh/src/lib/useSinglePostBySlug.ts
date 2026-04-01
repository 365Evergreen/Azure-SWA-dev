import { useEffect, useState } from 'react';
import type { PageBlock } from './usePageBlocks';

export function useSinglePostBySlug(slug: string | undefined): { id: string; title: string; blocks: PageBlock[]; content: string; featuredImage?: { node: { sourceUrl: string } } } | null {
  const [data, setData] = useState<{ id: string; title: string; blocks: PageBlock[]; content: string; featuredImage?: { node: { sourceUrl: string } } } | null>(null);
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchBySlug = async () => {
      try {
        const cleaned = String(slug).replace(/^\/+|\/+$/g, '');
        const query = `query postBySlug {\n  post(id: \"${cleaned}\", idType: SLUG) {\n    id\n    content(format: RENDERED)\n    editorBlocks { apiVersion blockEditorCategoryName clientId name parentClientId renderedHtml type }\n    slug\n    title\n    uri\n    featuredImage { node { sourceUrl } }\n  }\n}`;
        const resp = await fetch('https://365evergreendev.com/graphql', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }),
        });
        const json = await resp.json();
        const node = json?.data?.post;
        if (!node) {
          if (!cancelled) setData(null);
          return;
        }

        const editorBlocks = node.editorBlocks || [];
        const editorHtml = Array.isArray(editorBlocks) ? editorBlocks.map((b: any) => b?.renderedHtml || '').join('') : '';
        const contentVal = (editorHtml && editorHtml.length > 0) ? editorHtml : (node.content || '');

        // Map editorBlocks to PageBlock-like structure (name, attributes, innerHTML, innerBlocks)
        const mappedBlocks: PageBlock[] = Array.isArray(editorBlocks) ? editorBlocks.map((b: any) => ({
          name: b?.name || b?.type || 'unknown',
          attributes: b?.attributes || {},
          innerHTML: b?.renderedHtml || '',
          innerBlocks: b?.innerBlocks || [],
        })) : [];

        if (!cancelled) {
          setData({ id: node.id || node.slug || cleaned, title: node.title || '', blocks: mappedBlocks, content: contentVal || '', featuredImage: node.featuredImage });
        }
      } catch (err) {
        console.error('useSinglePostBySlug error', err);
        if (!cancelled) setData(null);
      }
    };

    fetchBySlug();
    return () => { cancelled = true; };
  }, [slug]);

  return data;
}
