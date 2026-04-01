import { useEffect, useState } from 'react';

export interface ResourceEdgeNode {
  id: string;
}

export interface ResourceFieldGroup {
  fieldGroupName?: string | null;
  lable?: string | null;
  resourcetype?: string | null;
  resourcepost?: {
    edges?: Array<{ node?: ResourceEdgeNode | null } | null> | null;
  } | null;
}

export interface ResourceItem {
  id: string;
  slug?: string | null;
  uri?: string | null;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  fieldGroup: ResourceFieldGroup | null;
  resourceType: string | null;
  label: string | null;
  relatedPostIds: string[];
}

interface HookState {
  resources: ResourceItem[];
  loading: boolean;
  error: string | null;
}

const GRAPHQL_ENDPOINT = 'https://365evergreendev.com/graphql';

const QUERY = `query e365Resources {
  e365resources {
    edges {
      node {
        id
        title
        slug
        uri
        excerpt(format: RENDERED)
        featuredImage {
          node {
            sourceUrl
          }
        }
        resourcefields {
          fieldGroupName
          lable
          resourcetype
          resourcepost {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
}`;

export function useE365Resources(): HookState {
  const [state, setState] = useState<HookState>({ resources: [], loading: true, error: null });

  useEffect(() => {
    let isActive = true;

    fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY })
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const json = await response.json();
        if (json.errors && json.errors.length > 0) {
          throw new Error(json.errors.map((err: { message?: string }) => err.message).join(', '));
        }
        const edges: Array<{ node?: unknown }> = json?.data?.e365resources?.edges ?? [];
        const resources: ResourceItem[] = edges
          .map(edge => edge?.node)
          .filter((node): node is Record<string, unknown> => Boolean((node as { id?: unknown })?.id))
          .map(node => {
            const rawNode = node as {
              id?: unknown;
              title?: unknown;
              excerpt?: unknown;
              featuredImage?: { node?: { sourceUrl?: unknown } } | null;
              resourcefields?: ResourceFieldGroup | null;
            };
            const typedFieldGroup = rawNode.resourcefields ?? null;
            const resourceType = typedFieldGroup?.resourcetype ?? null;
            const label = typedFieldGroup?.lable ?? null;
            const relatedPostIds = (typedFieldGroup?.resourcepost?.edges ?? [])
              .map(edgeItem => edgeItem?.node?.id)
              .filter((id): id is string => typeof id === 'string');

            return {
              id: typeof rawNode.id === 'string' ? rawNode.id : String(rawNode.id ?? ''),
              slug: typeof (rawNode as any).slug === 'string' ? (rawNode as any).slug : null,
              uri: typeof (rawNode as any).uri === 'string' ? (rawNode as any).uri : null,
              title: typeof rawNode.title === 'string' ? rawNode.title : '',
              excerpt: typeof rawNode.excerpt === 'string' ? rawNode.excerpt : '',
              featuredImageUrl: typeof rawNode.featuredImage?.node?.sourceUrl === 'string' ? rawNode.featuredImage.node.sourceUrl : null,
              fieldGroup: typedFieldGroup,
              resourceType,
              label,
              relatedPostIds
            } satisfies ResourceItem;
          });

        if (!isActive) {
          return;
        }
        setState({ resources, loading: false, error: null });
      })
      .catch(error => {
        if (!isActive) {
          return;
        }
        const message = error instanceof Error ? error.message : 'Failed to fetch resources';
        setState({ resources: [], loading: false, error: message });
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
