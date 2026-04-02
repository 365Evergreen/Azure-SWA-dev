import { useQuery } from '@tanstack/react-query';
import type { PageBlock } from './usePageBlocks';

export interface PageData {
  id: string;
  title: string;
  blocks: PageBlock[];
  content: string;
  featuredImage?: { node: { sourceUrl: string } };
  categories?: { edges: { node: { id: string; name: string; slug: string } }[] };
}

async function fetchPageBySlug(slug: string): Promise<PageData | null> {
  if (!slug) return null;
  const buildUris = () => {
    const asPath = slug.startsWith('/') ? slug : `/${slug}`;
    const withTrailing = asPath.endsWith('/') ? asPath : `${asPath}/`;
    const e365Uri = slug.startsWith('/e365-page/') ? slug : `/e365-page/${slug.replace(/^\//, '')}/`;
    return { asPath, withTrailing, e365Uri };
  };

  try {
    const { e365Uri, withTrailing } = buildUris();
    // e365page
    const e365Resp = await fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query e365pageQuery {\n  e365page(id: "${e365Uri}", idType: URI) {\n    title\n    uri\n    slug\n    editorBlocks { renderedHtml }\n    content(format: RENDERED)\n  }\n}`
      })
    });
    const e365Result = await e365Resp.json();
    const e365page = e365Result?.data?.e365page;
    if (e365page) {
      return {
        id: e365page.slug,
        title: e365page.title,
        blocks: [],
        content: e365page.content,
      } as PageData;
    }

    // page by URI
    try {
      const pageResp = await fetch('https://365evergreendev.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query pageByUri {\n  page(id: "${withTrailing}", idType: URI) {\n    title\n    uri\n    slug\n    editorBlocks { renderedHtml }\n    content(format: RENDERED)\n    featuredImage { node { sourceUrl } }\n  }\n}`
        }),
      });
      const pageResult = await pageResp.json();
      const pageNode = pageResult?.data?.page;
      if (pageNode) {
        const editorBlocks = (pageNode as Record<string, unknown>)['editorBlocks'] as Array<{ renderedHtml?: string }> | undefined;
        const editorHtml = Array.isArray(editorBlocks) ? editorBlocks.map(b => b?.renderedHtml || '').join('') : '';
        const contentVal = (editorHtml && editorHtml.length > 0) ? editorHtml : (pageNode.content || '');
        return {
          id: pageNode.slug,
          title: pageNode.title,
          blocks: [],
          content: contentVal,
          featuredImage: pageNode.featuredImage,
        } as PageData;
      }
    } catch {
      // fallthrough
    }

    // pages list fallback
    const pagesQuery = `query pages {\n  pages {\n    edges {\n      node {\n        id\n        title\n        uri\n        slug\n        editorBlocks { renderedHtml }\n        content(format: RENDERED)\n        featuredImage { node { sourceUrl } }\n      }\n    }\n  }\n}`;
    const pagesResp = await fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: pagesQuery }),
    });
    const pagesResult = await pagesResp.json();
    const nodes = pagesResult?.data?.pages?.edges?.map((e: { node: Record<string, unknown> }) => e.node) || [];

    const slugNorm = String(slug).replace(/^\/+|\/+$/g, '');
    const asPathNorm = '/' + slugNorm;
    const withTrailingNorm = asPathNorm + '/';

    const match = nodes.find((n: Record<string, unknown>) => {
      const rawUri = String(n.uri || '');
      const uriPath = rawUri.replace(/^https?:\/\/[^/]+/, '');
      const trimmed = uriPath.replace(/\/+$/g, '');
      const nodePath = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
      const nodePathTrailing = nodePath.endsWith('/') ? nodePath : nodePath + '/';
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
      return {
        id: slugVal || '',
        title: titleVal || '',
        blocks: [],
        content: contentVal,
        featuredImage: featuredImageNormalized,
      } as PageData;
    }

    // REST fallback
    try {
      const slugNorm2 = String(slug).replace(/^\/+|\/+$/g, '');
      const restResp = await fetch(`https://365evergreendev.com/wp-json/wp/v2/pages?slug=${encodeURIComponent(slugNorm2)}`);
      const restJson = await restResp.json();
      if (Array.isArray(restJson) && restJson.length > 0) {
        const page = restJson[0];
        const contentRendered = page?.content?.rendered || '';
        const titleText = (page?.title && (page.title.rendered || page.title)) || '';
        return { id: page.id ? String(page.id) : slugNorm2, title: titleText, blocks: [], content: contentRendered } as PageData;
      }
    } catch (restErr) {
      console.error('usePageBySlug - REST fallback failed', restErr);
    }

    return null;
  } catch (err) {
    console.error('Failed to fetch page data:', err);
    return null;
  }
}

export function usePageBySlug(slug: string | undefined): PageData | null {
  const { data } = useQuery({
    queryKey: ['pageBySlug', slug ?? ''],
    queryFn: () => fetchPageBySlug(slug ?? ''),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
  return data ?? null;
}