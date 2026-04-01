import { useEffect, useState } from 'react';

export interface PrivacyPolicyData {
  id: string;
  title: string;
  content: string;
}

interface GraphQLPrivacyPolicyNode {
  id?: unknown;
  title?: unknown;
  content?: unknown;
}

interface GraphQLPrivacyPolicyResponse {
  data?: {
    e365pageBy?: GraphQLPrivacyPolicyNode | null;
  } | null;
  errors?: Array<{ message?: string }> | null;
}

function parsePrivacyPolicy(node: GraphQLPrivacyPolicyNode | null | undefined): PrivacyPolicyData | null {
  if (!node || typeof node !== 'object') {
    return null;
  }

  const idValue = node.id;
  const id = typeof idValue === 'string' ? idValue : typeof idValue === 'number' ? String(idValue) : null;
  const title = typeof node.title === 'string' && node.title.trim().length > 0 ? node.title.trim() : 'Privacy Policy';
  const content = typeof node.content === 'string' ? node.content : '';

  if (!id || content.length === 0) {
    return null;
  }

  return { id, title, content };
}

export function usePrivacyPolicy() {
  const [data, setData] = useState<PrivacyPolicyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchPrivacyPolicy() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://365evergreendev.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query PrivacyPolicyPage {\n  e365pageBy(slug: "/e365-page/privacy-policy/") {\n    id\n    title\n    content(format: RENDERED)\n  }\n}`
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = (await response.json()) as GraphQLPrivacyPolicyResponse;

        if (!mounted) {
          return;
        }

        if (result.errors && result.errors.length > 0) {
          setError(result.errors.map(e => e?.message).filter(Boolean).join('\n') || 'Unable to load privacy policy.');
          setData(null);
          setLoading(false);
          return;
        }

        const parsed = parsePrivacyPolicy(result.data?.e365pageBy ?? null);
        setData(parsed);
        setLoading(false);

        if (!parsed) {
          setError('Privacy policy content is unavailable.');
        }
      } catch (err) {
        if (!mounted) {
          return;
        }
        if ((err as Error).name === 'AbortError') {
          return;
        }
        setError((err as Error).message || 'Unable to load privacy policy.');
        setData(null);
        setLoading(false);
      }
    }

    fetchPrivacyPolicy();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return { data, loading, error };
}
