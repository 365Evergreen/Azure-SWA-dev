import { useQuery, QueryClient } from '@tanstack/react-query';

const WPGRAPHQL_URL = 'https://365evergreendev.com/graphql';

export interface WPCategory {
  id: string;
  name: string;
  slug: string;
  uri: string;
  parent?: { node?: { id: string } };
}

async function fetchAllCategories(): Promise<WPCategory[]> {
  const res = await fetch(WPGRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query categories { categories { nodes { id name slug uri parent { node { id } } } } }`,
    }),
  });
  const json = await res.json();
  return json?.data?.categories?.nodes || [];
}

export function useAllCategories() {
  const { data, isLoading, error } = useQuery<WPCategory[], Error>(['allCategories'], fetchAllCategories);
  return { categories: data ?? [], loading: isLoading, error: error ?? null };
}

export function prefetchAllCategories(queryClient: QueryClient) {
  return queryClient.prefetchQuery(['allCategories'], fetchAllCategories);
}