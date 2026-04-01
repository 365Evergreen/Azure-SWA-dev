import { useEffect, useState } from 'react';

export interface SinglePostData {
  id: string;
  title: string;
  content?: string;
  editorBlocks?: Array<any>;
  blocks?: Array<{
    name: string;
    attributes?: Record<string, unknown>;
    innerHTML?: string;
    innerBlocks?: any[];
  }>;
  slug?: string;
  uri?: string;
  featuredImage?: { node: { sourceUrl: string } };
}

export function useSinglePost(uri: string | undefined): SinglePostData | null {
  const [data, setData] = useState<SinglePostData | null>(null);

  useEffect(() => {
    if (!uri) return;

    let cancelled = false;

    const fetchPost = async () => {
      try {
        const query = `query singlePost {\n  postBy(uri: \"${uri}\") {\n    id\n    content(format: RENDERED)\n    editorBlocks {\n      apiVersion\n      blockEditorCategoryName\n      clientId\n      name\n      parentClientId\n      renderedHtml\n      type\n    }\n    slug\n    title\n    uri\n    featuredImage { node { sourceUrl } }\n  }\n}`;

        const resp = await fetch('https://365evergreendev.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const json = await resp.json();
        const node = json?.data?.postBy;
        if (!node) {
          if (!cancelled) setData(null);
          return;
        }

        // Some posts may provide editorBlocks with renderedHtml; prefer that when present
        let contentVal = node.content || '';
        const editorBlocks = node.editorBlocks || [];
        if (Array.isArray(editorBlocks) && editorBlocks.length > 0) {
          const editorHtml = editorBlocks.map((b: any) => b?.renderedHtml || '').join('');
          if (editorHtml && editorHtml.length > 0) contentVal = editorHtml;
        }

        // Map editorBlocks to a shape compatible with PageBlocks (name, attributes, innerHTML, innerBlocks)
        const mappedBlocks = Array.isArray(editorBlocks)
          ? editorBlocks.map((b: any) => ({
              name: b?.name || b?.type || 'unknown',
              attributes: b?.attributes || {},
              innerHTML: b?.renderedHtml || b?.innerHTML || '',
              innerBlocks: b?.innerBlocks || [],
            }))
          : [];

        if (!cancelled) {
          setData({
            id: node.id || node.slug || uri,
            title: node.title || '',
            content: contentVal || undefined,
            editorBlocks: editorBlocks.length ? editorBlocks : undefined,
            blocks: mappedBlocks.length ? mappedBlocks : undefined,
            slug: node.slug,
            uri: node.uri,
            featuredImage: node.featuredImage,
          });
        }
      } catch (err) {
        console.error('useSinglePost fetch error', err);
        if (!cancelled) setData(null);
      }
    };

    fetchPost();
    return () => { cancelled = true; };
  }, [uri]);

  return data;
}
