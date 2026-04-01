import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@fluentui/react-components';
import { useCtaPost } from '../../lib/useCtaPost';
import PageBlocks from '../PageBlocks/PageBlocks';
import { TenantAuditForm } from '../TenantAuditForm/TenantAuditForm';

export const CtaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = useCtaPost(slug);

  // Build breadcrumb: Home / Post Title
  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    { text: page?.title || slug, href: `/CTA/${slug}` },
  ];

  return (
    <section style={{ minHeight: 300, padding: 0, margin: 0 }}>
      <Breadcrumb>
        {breadcrumbItems.map((item, idx) => (
          <BreadcrumbItem key={item.href + '-' + idx}>
            {idx < breadcrumbItems.length - 1 ? (
              <>
                <Link to={item.href}>{item.text}</Link>
                <span style={{ margin: '0 0.5em', color: '#888' }}>/</span>
              </>
            ) : (
              <span>{item.text}</span>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <h2>{page?.title || 'Loading...'}</h2>
      <div style={{ width: '100%', margin: 0, padding: 0 }}>
        {page ? (
          page.blocks && page.blocks.length > 0 ? (
            <PageBlocks blocks={page.blocks} />
          ) : page.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            <em>No content found…</em>
          )
        ) : (
          <em>Loading content…</em>
        )}
      </div>
      <TenantAuditForm />
    </section>
  );
};

export default CtaPage;

