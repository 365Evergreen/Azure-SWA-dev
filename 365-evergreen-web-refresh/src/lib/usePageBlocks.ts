import { useQuery, QueryClient } from '@tanstack/react-query';

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

async function fetchPageBlocks(idOrSlug: string, nodeType: 'page' | 'post') {
  const res = await fetch('https://365evergreendev.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query GetNode {\n  ${nodeType}(id: "${idOrSlug}") {\n    id\n    title\n    blocks\n  }\n}`
    })
  });
  const result = await res.json();
  const node = result?.data?.[nodeType];
  let blocks: PageBlock[] = [];
  try {
    blocks = node?.blocks ? JSON.parse(node.blocks) : [];
  } catch {
    blocks = [];
  }
  return { id: node?.id, title: node?.title, blocks } as PageData;
}

export function usePageBlocks(
  idOrSlug: string | null,
  nodeType: 'page' | 'post' = 'page'
): PageData | null {
  const { data } = useQuery<PageData, Error>(['pageBlocks', nodeType, idOrSlug], () => fetchPageBlocks(idOrSlug as string, nodeType), {
    enabled: Boolean(idOrSlug)
  });
  return data ?? null;
}

export function prefetchPageBlocks(queryClient: QueryClient, idOrSlug: string, nodeType: 'page' | 'post' = 'page') {
  return queryClient.prefetchQuery(['pageBlocks', nodeType, idOrSlug], () => fetchPageBlocks(idOrSlug, nodeType));
}
