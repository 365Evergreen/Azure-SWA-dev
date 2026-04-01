import React from 'react';
import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '../BreadcrumbContext';
import { useAccordionItemBySlug } from '../../lib/useAccordionItemBySlug';

const WhatWeDoItem: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const item = useAccordionItemBySlug(slug);

  if (!slug) return <em>No item specified</em>;

  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    { text: 'What we do', href: '/what-we-do' },
    { text: item?.title || (slug || 'Item'), href: `/what-we-do/${slug}` },
  ];

  const { setItems } = useBreadcrumb();

  React.useEffect(() => {
    setItems(breadcrumbItems);
    return () => setItems([]);
  }, [setItems, item?.title, slug]);

  return (
    <main style={{ padding: '2rem 4vw' }}>
      {item ? (
        <article>
          <h1>{item.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </article>
      ) : (
        <em>Loading content…</em>
      )}
    </main>
  );
};

export default WhatWeDoItem;
