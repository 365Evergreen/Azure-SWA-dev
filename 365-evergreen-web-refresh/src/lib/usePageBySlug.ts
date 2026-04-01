import { useEffect, useState } from 'react';
import type { PageBlock } from './usePageBlocks';

export interface PageData {
  id: string;
  title: string;
  blocks: PageBlock[];
  content: string;
  featuredImage?: { node: { sourceUrl: string } };
  categories?: { edges: { node: { id: string; name: string; slug: string } }[] };
}

export function usePageBySlug(slug: string | undefined): PageData | null {
  const [data, setData] = useState<PageData | null>(null);
  useEffect(() => {
    console.debug('usePageBySlug - hook invoked with slug:', slug);
    if (!slug) return;
    // Prepend CPT base for e365page
    const buildUris = () => {
      // possible URIs to match against pages: with and without leading/trailing slashes
      const asPath = slug.startsWith('/') ? slug : `/${slug}`;
      const withTrailing = asPath.endsWith('/') ? asPath : `${asPath}/`;
      const e365Uri = slug.startsWith('/e365-page/') ? slug : `/e365-page/${slug.replace(/^\//, '')}/`;
      return { asPath, withTrailing, e365Uri };
    };

    (async () => {
      try {
        const { e365Uri, withTrailing, asPath } = buildUris();
        console.debug('usePageBySlug - built URIs', { asPath, withTrailing, e365Uri });

        // Try e365page first
        const e365Resp = await fetch('https://365evergreendev.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query e365pageQuery {\n  e365page(id: "${e365Uri}", idType: URI) {\n    title\n    uri\n    slug\n    editorBlocks { renderedHtml }\n    content(format: RENDERED)\n  }\n}`
          })
        });
        const e365Result = await e365Resp.json();
        console.debug('usePageBySlug - e365Result', e365Result);
        const e365page = e365Result?.data?.e365page;
        if (e365page) {
          setData({
            id: e365page.slug,
            title: e365page.title,
            blocks: [],
            content: e365page.content,
            featuredImage: undefined,
            categories: undefined,
          });
          return;
        }

        // Try direct `page` query by URI (more efficient than listing pages)
        try {
          const pageResp = await fetch('https://365evergreendev.com/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `query pageByUri {\n  page(id: "${withTrailing}", idType: URI) {\n    title\n    uri\n    slug\n    editorBlocks { renderedHtml }\n    content(format: RENDERED)\n    featuredImage { node { sourceUrl } }\n  }\n}`
            }),
          });
          const pageResult = await pageResp.json();
          console.debug('usePageBySlug - pageByUri result', pageResult);
          const pageNode = pageResult?.data?.page;
          if (pageNode) {
            const editorBlocks = (pageNode as Record<string, unknown>)['editorBlocks'] as Array<{ renderedHtml?: string }> | undefined;
            const editorHtml = Array.isArray(editorBlocks) ? editorBlocks.map(b => b?.renderedHtml || '').join('') : '';
            const contentVal = (editorHtml && editorHtml.length > 0) ? editorHtml : (pageNode.content || '');
            setData({
              id: pageNode.slug,
              title: pageNode.title,
              blocks: [],
              content: contentVal,
              featuredImage: pageNode.featuredImage,
              categories: undefined,
            });
            return;
          }
        } catch {
          // ignore and fall through to listing fallback
        }

        // Fallback: query standard pages (include editorBlocks if plugin exposes them)
        const pagesQuery = `query pages {\n  pages {\n    edges {\n      node {\n        id\n        title\n        uri\n        slug\n        editorBlocks { renderedHtml }\n        content(format: RENDERED)\n        featuredImage { node { sourceUrl } }\n      }\n    }\n  }\n}`;
        const pagesResp = await fetch('https://365evergreendev.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: pagesQuery }),
        });
        const pagesResult = await pagesResp.json();
        console.debug('usePageBySlug - pagesResult', pagesResult);
        const nodes = pagesResult?.data?.pages?.edges?.map((e: { node: Record<string, unknown> }) => e.node) || [];
        // Normalize incoming slug/uri for matching
        const slugNorm = String(slug).replace(/^\/+|\/+$/g, '');
        const asPathNorm = '/' + slugNorm;
        const withTrailingNorm = asPathNorm + '/';

        const match = nodes.find((n: Record<string, unknown>) => {
          const rawUri = String(n.uri || '');
          // strip domain if present
          const uriPath = rawUri.replace(/^https?:\/\/[^/]+/, '');
          // normalize: remove trailing slashes, ensure single leading slash
          const trimmed = uriPath.replace(/\/+$/g, '');
          const nodePath = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
          const nodePathTrailing = nodePath.endsWith('/') ? nodePath : nodePath + '/';
          // compare normalized uri forms and slug
          if (nodePath === asPathNorm || nodePath === withTrailingNorm || nodePathTrailing === withTrailingNorm) return true;
          if (String(n.slug || '') === slugNorm) return true;
          return false;
        });
        if (match) {
          const editorBlocks = (match as Record<string, unknown>)['editorBlocks'] as Array<{ renderedHtml?: string }> | undefined;
          const editorHtml = Array.isArray(editorBlocks) ? editorBlocks.map(b => b?.renderedHtml || '').join('') : '';
          const slugVal = (match as Record<string, unknown>)['slug'] as string | undefined;
          const titleVal = (match as Record<string, unknown>)['title'] as string | undefined;
          const featured = (match as Record<string, unknown>)['featuredImage'] as { node?: { sourceUrl?: string } } | undefined;
          const contentVal = (editorHtml && editorHtml.length > 0) ? editorHtml : ((match as Record<string, unknown>)['content'] as string || '');
          const featuredImageNormalized = (featured && featured.node && typeof featured.node.sourceUrl === 'string') ? { node: { sourceUrl: featured.node.sourceUrl as string } } : undefined;
          setData({
            id: slugVal || '',
            title: titleVal || '',
            blocks: [],
            content: contentVal,
            featuredImage: featuredImageNormalized,
            categories: undefined,
          });
        } else {
          // Try REST API fallback using slug
          try {
            console.debug('usePageBySlug - no GraphQL match, trying REST fallback for slug', slugNorm);
            const restResp = await fetch(`https://365evergreendev.com/wp-json/wp/v2/pages?slug=${encodeURIComponent(slugNorm)}`);
            const restJson = await restResp.json();
            console.debug('usePageBySlug - REST response', restJson);
            if (Array.isArray(restJson) && restJson.length > 0) {
              const page = restJson[0];
              const contentRendered = page?.content?.rendered || '';
              const titleText = (page?.title && (page.title.rendered || page.title)) || '';
              setData({ id: page.id ? String(page.id) : slugNorm, title: titleText, blocks: [], content: contentRendered, featuredImage: undefined, categories: undefined });
            } else {
              setData(null);
            }
          } catch (restErr) {
            console.error('usePageBySlug - REST fallback failed', restErr);
            setData(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch page data:', err);
        setData(null);
      }
    })();
  }, [slug]);
  return data;
}