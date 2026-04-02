import { useQuery } from '@tanstack/react-query';

export interface RawPillar {
  id: string;
  title: string;
  slug: string;
  uri?: string;
  e365featurepage?: {
    blurb?: string;
    buttonText?: string;
    icon?: string;
    sortOrder?: number;
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  content?: string;
}

export function usePillars(limit?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['pillars', limit ?? 'all'],
    queryFn: () => prefetchPillars(limit),
    staleTime: 5 * 60 * 1000,
    enabled,
  }).data ?? [];
}

let pillarsCache: RawPillar[] | null = null;
let pillarsPromise: Promise<RawPillar[]> | null = null;

export function prefetchPillars(limit?: number): Promise<RawPillar[]> {
  if (pillarsCache) return Promise.resolve(pillarsCache);
  if (pillarsPromise) return pillarsPromise;

  const query = `query featurePages {\n  featurePages {\n    edges {\n      node {\n        id\n        title\n        slug\n        uri\n        e365featurepage {\n          blurb\n          buttonText\n          icon\n          sortOrder\n        }\n        featuredImage {\n          node {\n            sourceUrl\n          }\n        }\n        content(format: RENDERED)\n      }\n    }\n  }\n}`;

  pillarsPromise = fetch('https://365evergreendev.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
    .then(res => res.json())
    .then(result => {
      const nodes: RawPillar[] = result?.data?.featurePages?.edges?.map((e: { node: RawPillar }) => e.node) || [];
      nodes.sort((a: RawPillar, b: RawPillar) => {
        const aOrder = a.e365featurepage?.sortOrder ?? 0;
        const bOrder = b.e365featurepage?.sortOrder ?? 0;
        return aOrder - bOrder;
      });
      const final = limit ? nodes.slice(0, limit) : nodes;
      pillarsCache = final;
      pillarsPromise = null;
      return final;
    })
    .catch(err => {
      pillarsPromise = null;
      console.error('Failed to fetch featurePages from WPGraphQL:', err);
      throw err;
    });

  return pillarsPromise;
}
