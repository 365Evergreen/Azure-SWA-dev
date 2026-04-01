import { useEffect, useState } from 'react';

const WPGRAPHQL_URL = 'https://365evergreendev.com/graphql';

export interface WPCategory {
  id: string;
  name: string;
  slug: string;
  uri: string;
  parent?: { node?: { id: string } };
}

export function useAllCategories() {
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(WPGRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query categories { categories { nodes { id name slug uri parent { node { id } } } } }`,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setCategories(data?.data?.categories?.nodes || []);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}