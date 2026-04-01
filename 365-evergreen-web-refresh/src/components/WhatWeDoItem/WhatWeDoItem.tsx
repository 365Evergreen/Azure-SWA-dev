import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@fluentui/react-components';
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

  return (
    <main style={{ padding: '2rem 4vw' }}>
      <Breadcrumb>
        {breadcrumbItems.map((b, idx) => (
          <React.Fragment key={b.href + '-' + idx}>
            <BreadcrumbItem>
              {idx < breadcrumbItems.length - 1 ? (
                <Link to={b.href}>{b.text}</Link>
              ) : (
                <span>{b.text}</span>
              )}
            </BreadcrumbItem>
            {idx < breadcrumbItems.length - 1 && (
              <span style={{ margin: '0 0.5em', color: '#888' }}>/</span>
            )}
          </React.Fragment>
        ))}
      </Breadcrumb>

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
