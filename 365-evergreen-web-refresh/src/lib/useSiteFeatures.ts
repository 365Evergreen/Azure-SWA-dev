import { useQuery } from '@tanstack/react-query';

export interface SiteFeature {
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage?: { node: { sourceUrl: string } };
  siteFeature: {
    fieldGroupName: string;
    blurb: string;
    icon: string;
    title: string;
    sortOrder?: number;
    buttonText?: string;
    link?: {
      target?: string;
      title?: string;
      url?: string;
    };
  };
}

export function useSiteFeatures() {
  return useQuery({
    queryKey: ['siteFeatures'],
    queryFn: fetchSiteFeatures,
    staleTime: 5 * 60 * 1000,
  }).data ?? [];
}

export function fetchSiteFeatures(): Promise<SiteFeature[]> {
  return fetch('https://365evergreendev.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query siteFeatures {\n  features {\n    nodes {\n      id\n      title\n      content\n      slug\n      featuredImage { node { sourceUrl } }\n      siteFeature {\n        fieldGroupName\n        blurb\n        icon\n        title\n        sortOrder\n        buttonText\n        link { target title url }\n      }\n    }\n  }\n}`
    }),
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch site features');
      return res.json();
    })
    .then(data => data?.data?.features?.nodes || []);
}
