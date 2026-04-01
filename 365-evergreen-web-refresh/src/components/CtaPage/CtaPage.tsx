import React from 'react';
import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '../BreadcrumbContext';
import { useCtaPost } from '../../lib/useCtaPost';
import PageBlocks from '../PageBlocks/PageBlocks';
import { TenantAuditForm } from '../TenantAuditForm/TenantAuditForm';

export const CtaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = useCtaPost(slug);

  // Build breadcrumb: Home / Post Title
  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    { text: (page?.title ?? slug ?? ''), href: `/CTA/${slug}` },
  ];

  const { setItems } = useBreadcrumb();

  React.useEffect(() => {
    setItems(breadcrumbItems);
    return () => setItems([]);
  }, [setItems, page?.title, slug]);

  return (
    <section style={{ minHeight: 300, padding: 0, margin: 0 }}>
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

