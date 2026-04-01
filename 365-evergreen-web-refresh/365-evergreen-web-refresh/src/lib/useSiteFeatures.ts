import { useEffect, useState } from 'react';

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
  const [features, setFeatures] = useState<SiteFeature[]>([]);
  useEffect(() => {
    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query siteFeatures {\n  features {\n    nodes {\n      id\n      title\n      content\n      slug\n      featuredImage { node { sourceUrl } }\n      siteFeature {\n        fieldGroupName\n        blurb\n        icon\n        title\n        sortOrder\n        buttonText\n        link { target title url }\n      }\n    }\n  }\n}`
      })
    })
      .then(res => res.json())
      .then(data => {
        setFeatures(data?.data?.features?.nodes || []);
      });
  }, []);
  return features;
}
