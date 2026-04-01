import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { useBreadcrumb } from '../BreadcrumbContext';
import { usePageBySlug } from '../../lib/usePageBySlug';
import type { PageData } from '../../lib/usePageBySlug';
import './PageView.module.css';
import { useCtaPost } from '../../lib/useCtaPost';
import { useSinglePostBySlug } from '../../lib/useSinglePostBySlug';
import { useE365Resources } from '../ResourceArchive/useE365Resources';
import PageRenderer from '../PageRenderer/PageRenderer';
import ResourceDetail from '../ResourceArchive/ResourceDetail';
import ResponsiveContainer from '../ResponsiveContainer/ResponsiveContainer';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { useEffect, useState } from 'react';

export const PageView: React.FC<{ whatWeDoPageId?: string }> = ({ whatWeDoPageId }) => {
  const { slug, parent } = useParams<{ slug?: string; parent?: string }>();
  const [explicitPage, setExplicitPage] = useState<PageData | null>(null);

  // Build URI for custom post types. If route params are missing (e.g. direct '/what-we-do'),
  // use the current location pathname so usePageBySlug can match by URI.
  const location = useLocation();
  let uri = '';
  if (slug) {
    uri = slug || '';
    if (parent) {
      uri = `/${parent}/${slug}/`;
    }
  } else {
    uri = location.pathname || '';
  }
  // Fetch page by URI
  const page = usePageBySlug(uri);

  // Fetch post by URI (some content may be posts rather than pages, so we attempt both)

  // If a specific page ID prop is provided (e.g., /what-we-do), fetch that page by ID
  useEffect(() => {
    if (!whatWeDoPageId) return;
    let cancelled = false;
    (async () => {
      try {
        const q = `query pageById { page(id: "${whatWeDoPageId}", idType: ID) { title uri slug editorBlocks { renderedHtml } content(format: RENDERED) featuredImage { node { sourceUrl } } } }`;
        const resp = await fetch('https://365evergreendev.com/graphql', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }),
        });
        const res = await resp.json();
        console.debug('PageView - pageById response', res);
        const node = res?.data?.page;
        if (node && !cancelled) {
          const editorBlocks = node.editorBlocks || [];
          const editorHtml = Array.isArray(editorBlocks) ? editorBlocks.map((b: any) => b?.renderedHtml || '').join('') : '';
          const contentVal = (editorHtml && editorHtml.length > 0) ? editorHtml : (node.content || '');
          console.debug('PageView - explicit page parsed', { id: node.slug || whatWeDoPageId, title: node.title, contentVal });
          setExplicitPage({ id: node.slug || whatWeDoPageId, title: node.title || '', blocks: [], content: contentVal, featuredImage: node.featuredImage });
        }
      } catch (err) {
        console.error('Failed to fetch explicit page by ID', err);
      }
    })();
    return () => { cancelled = true; };
  }, [whatWeDoPageId]);
  // If no e365page found, try fetching a regular post by slug (CTA or normal post)
  const ctaPost = useCtaPost(slug);
  const singlePostBySlug = useSinglePostBySlug(slug);
  // Also attempt to find a Resource (by slug or uri) and render it using a dedicated ResourceDetail view
  const { resources } = useE365Resources();
  const resourceSlug = slug || ((): string => {
    const m = String(uri || '').match(/\/e365-page\/(.+?)\/?$/);
    return m ? m[1] : '';
  })();
  const resource = resources.find(r => (typeof r.slug === 'string' && r.slug === resourceSlug) || (typeof r.uri === 'string' && r.uri === uri) || String(r.id) === resourceSlug);

  console.debug('PageView - debug', { slug, uri, page, ctaPost, resource });

  useEffect(() => {
    console.debug('PageView - explicitPage state changed', explicitPage);
  }, [explicitPage]);

  // Build breadcrumb: Home / Category (if present) / Post Title
  const params = useParams<{ slug?: string; category?: string }>();
  const category = params.category;
  const pageToRender = explicitPage || page;
  // If there's no page but we have a single post fetched by slug, prefer it for rendering
  const postPage = !pageToRender && singlePostBySlug ? {
    id: singlePostBySlug.id,
    title: singlePostBySlug.title,
    blocks: singlePostBySlug.blocks,
    content: singlePostBySlug.content,
    featuredImage: singlePostBySlug.featuredImage,
  } : null;
  const effectivePage = pageToRender || postPage;
  console.debug('PageView - pageToRender', pageToRender);
  const titleText = effectivePage?.title || ctaPost?.title || resource?.title || (params.slug || 'Page');
  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    ...(category ? [{ text: category.charAt(0).toUpperCase() + category.slice(1), href: `/${category}` }] : []),
    { text: titleText, href: `/${category ? category + '/' : ''}${params.slug || ''}` },
  ];

  const { setItems } = useBreadcrumb();

  // Update global breadcrumb when title or category changes
  React.useEffect(() => {
    setItems(breadcrumbItems);
    return () => setItems([]);
  }, [setItems, titleText, category]);

  return (
    <section className="pageViewRoot">
      <h2>{titleText}</h2>
      {(effectivePage || singlePostBySlug) && <AudioPlayer src="#" />}
      <ResponsiveContainer>
        {resource ? (
          <ResourceDetail resource={resource} />
        ) : effectivePage ? (
          effectivePage.blocks && effectivePage.blocks.length > 0 ? (
            <PageRenderer blocks={effectivePage.blocks} />
          ) : effectivePage.content ? (
            <div dangerouslySetInnerHTML={{ __html: effectivePage.content }} />
          ) : <em>No content found…</em>
        ) : ctaPost ? (
          <div dangerouslySetInnerHTML={{ __html: ctaPost.content || '' }} />
        ) : <em>Loading page content…</em>}
      </ResponsiveContainer>
    </section>
  );
};


