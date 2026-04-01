import '../WhatWeDo.css';
import { useAllPagesWithBlocks } from '../../lib/useAllPagesWithBlocks';
import { usePageBySlug } from '../../lib/usePageBySlug';

const WHAT_WE_DO_SLUG = 'what-we-do';

const WhatWeDo: React.FC = () => {
  const pages = useAllPagesWithBlocks();
  const page = pages?.find(p => p.slug === WHAT_WE_DO_SLUG);
  // Fetch the rendered WP content by slug (hook constructs the `/e365-page/...` URI)
  const pageContent = usePageBySlug(WHAT_WE_DO_SLUG);

  if (!page) return <div className="whatwedo-root"><p>Loading…</p></div>;

  return (
    <div className="whatwedo-root">
      <h1 className="whatwedo-title">{pageContent?.title || page.name}</h1>
      {pageContent?.content ? (
        <div className="whatwedo-intro" dangerouslySetInnerHTML={{ __html: pageContent.content }} />
      ) : null}

      {page.blocks && page.blocks.length > 0 ? (
        <div className="whatwedo-blocks">
          {page.blocks.map((block, i) => (
            <div key={i} className={`whatwedo-block whatwedo-block--${block.name ? block.name.replace(/[^a-z0-9]/gi, '-') : 'unknown'}`}
                 dangerouslySetInnerHTML={{ __html: block.htmlContent || block.dynamicContent || block.innerHTML || '' }} />
          ))}
        </div>
      ) : (
        <em>No blocks found…</em>
      )}
    </div>
  );
};

export default WhatWeDo;
