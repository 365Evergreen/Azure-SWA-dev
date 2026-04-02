import { useQuery, QueryClient } from '@tanstack/react-query';

export interface AccordionPanelData {
  title: string;
  content: string;
}

export interface AccordionGroupData {
  id: number;
  title: string;
  description?: string;
  header?: string;
  image?: string;
  feature?: string;
  featureId?: string;
  panels: AccordionPanelData[];
}

async function fetchAzureAccordions(featureId?: string): Promise<AccordionGroupData[]> {
  const [accordionMetaRes, accordionItemsRes] = await Promise.all([
    fetch('https://365evergreendev.blob.core.windows.net/365evergreen/accordions.json'),
    fetch('https://365evergreendev.blob.core.windows.net/365evergreen/accordion-list.json')
  ]);
  const accordionMeta = await accordionMetaRes.json();
  const accordionItems = await accordionItemsRes.json();

  const accordions = Array.isArray(accordionMeta) ? accordionMeta : [accordionMeta];
  const items = Array.isArray(accordionItems) ? accordionItems : [accordionItems];

  let filteredAccordions = accordions;
  if (featureId) {
    filteredAccordions = accordions.filter((acc: any) => acc.featureId === featureId);
  }

  const grouped: AccordionGroupData[] = filteredAccordions.map((acc: any) => {
    const panels = items
      .filter((item: any) => item.parentId === acc.id)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((item: any) => ({
        title: item.label,
        content: item.blurb
      }));

    return {
      id: acc.id,
      title: acc.label,
      description: acc.blurb,
      image: acc.image,
      feature: acc.feature,
      featureId: acc.featureId,
      panels
    };
  });

  return grouped;
}

export function useAzureAccordions(featureId?: string): AccordionGroupData[] {
  const { data } = useQuery(['azureAccordions', featureId], () => fetchAzureAccordions(featureId));
  return data ?? [];
}

export function prefetchAzureAccordions(queryClient: QueryClient, featureId?: string) {
  return queryClient.prefetchQuery(['azureAccordions', featureId], () => fetchAzureAccordions(featureId));
}
