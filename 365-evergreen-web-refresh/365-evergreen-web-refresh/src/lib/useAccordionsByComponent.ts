import { useEffect, useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const WP_GRAPHQL_ENDPOINT = 'https://365evergreendev.com/graphql';

export type AccordionItem = {
  id: number | string;
  parentId: number | string;
  label: string;
  slug?: string | null;
  blurb: string; // always string for UI
  order?: number | null;
  imageUrl?: string | null;
};

export type Accordion = {
  id: number | string;
  title: string;
  label: string; // always present
  blurb: string; // always string
  imageUrl?: string | null;
  componentname?: string[] | null;
  // numeric sort key used to order buttons (falls back to original sequence)
  sortby?: number;
};

export function useAccordionsByComponent(componentName: string) {
  const [accordions, setAccordions] = useState<Accordion[]>([]);
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(WP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query AllE365AccordionsWithFields($first: Int) {
          e365Accordions(first: $first) {
            nodes {
              id
              databaseId
              slug
              content
              featuredImage { node { sourceUrl } }
              # Title is only available on some node types; request via NodeWithTitle fragment
              ... on NodeWithTitle { title }
              accordionFields {
                componentname
                label
                imageurl { node { link uri } }
                sortby
                items {
                  nodes {
                    __typename
                    id
                    databaseId
                    slug
                    # Item title may be available on NodeWithTitle
                    ... on NodeWithTitle { title }
                    ... on Post { content featuredImage { node { sourceUrl } } }
                    ... on Page { content featuredImage { node { sourceUrl } } }
                    ... on AccordionItem { content }
                  }
                }
              }
            }
          }
        }`,


        variables: { first: 200 }
      })
    })
      .then(res => res.json())
      .then(json => {
        if (cancelled) return;
        if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
        const nodes = (json.data?.e365Accordions?.nodes) || [];
        // Map accordions
        const accs: Accordion[] = nodes.map((n: any, idx: number) => ({
          id: n.databaseId ?? n.id,
          title: n.title,
          label: n.accordionFields?.label ?? n.title ?? '',
          blurb: n.content ?? '',
          imageUrl: n.accordionFields?.imageurl?.node?.link?.uri ?? n.accordionFields?.imageurl?.node?.link ?? n.featuredImage?.node?.sourceUrl ?? null,
          componentname: Array.isArray(n.accordionFields?.componentname) ? n.accordionFields.componentname : (n.accordionFields?.componentname ? [n.accordionFields.componentname] : null),
          // Normalize sortby to a numeric key; fallback to original index to keep stable ordering
          sortby: typeof n.accordionFields?.sortby === 'number' ? n.accordionFields.sortby : (n.accordionFields?.sortby ? Number(n.accordionFields.sortby) : idx),
        }));

        // Map items into a flat list with parentId
        const accItems: AccordionItem[] = [];
        nodes.forEach((n: any) => {
          const parentId = n.databaseId ?? n.id;
          const itemNodes = n.accordionFields?.items?.nodes || [];
          itemNodes.forEach((it: any, idx2: number) => {
            // Prefer explicit sortOrder from multiple possible fields; fallback to sequence
            const explicitOrderCandidates = ['sortOrder','sortorder','menuOrder','order','sort_by','sortby'];
            let explicitOrder: number | undefined = undefined;
            for (const k of explicitOrderCandidates) {
              if (typeof it[k] === 'number') {
                explicitOrder = it[k];
                break;
              }
            }
            const order = explicitOrder ?? (idx2 + 1);

            // Determine content: prefer content/excerpt/blurb/description or first non-empty string field
            let content: string | undefined = undefined;
            if (typeof it.content === 'string' && it.content.trim()) content = it.content;
            else if (typeof it.excerpt === 'string' && it.excerpt.trim()) content = it.excerpt;
            else if (typeof it.blurb === 'string' && it.blurb.trim()) content = it.blurb;
            else if (typeof it.description === 'string' && it.description.trim()) content = it.description;
            else {
              // fallback: pick first non-empty string property on the node (excluding title/slug)
              for (const key of Object.keys(it)) {
                const val = it[key];
                if (typeof val === 'string' && val.trim() && !['title','slug'].includes(key)) {
                  content = val;
                  break;
                }
              }
            }

            accItems.push({
              id: it.databaseId ?? it.id,
              parentId,
              label: it.title ?? '',
              slug: it.slug ?? null,
              blurb: content ?? '',
              order,
              imageUrl: it.featuredImage?.node?.sourceUrl ?? null,
            });
          });
        });

        // Filter by componentName (case-sensitive match on list)
        let filteredAccs = accs.filter(a => Array.isArray(a.componentname) && a.componentname.includes(componentName));
        // Sort by numeric sortby (we normalized sortby to numeric or original index)
        filteredAccs = filteredAccs.sort((a, b) => ( (a.sortby ?? 0) - (b.sortby ?? 0) ));
        const filteredAccIds = new Set(filteredAccs.map(a => a.id));
        const filteredItems = accItems.filter(it => filteredAccIds.has(it.parentId));

        setAccordions(filteredAccs);
        setItems(filteredItems);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || String(err));
        setAccordions([]);
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [componentName]);

  return { accordions, items, loading, error };
}
