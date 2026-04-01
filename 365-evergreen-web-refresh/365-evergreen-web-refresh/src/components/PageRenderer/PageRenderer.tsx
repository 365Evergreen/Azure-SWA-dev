import { Hero } from '../Hero/Hero';
import WhatWeDoAccordion from '../WhatWeDoAccordion/WhatWeDoAccordion';
import { CTA } from '../CTA/CTA';
import { Features } from '../Features/Features';
import ResponsiveImage from '../ResponsiveImage/ResponsiveImage';
import type { PageBlock } from '../FeaturePage/usePageBlocks';

export default function PageRenderer({ blocks }: { blocks: PageBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <>
      {blocks.map((b, i) => {
        const name = (b.name || '').toLowerCase();
        const attrs = (b.attributes || {}) as Record<string, unknown>;
        // map common block names to components
        if (name.includes('hero'))
          return (
            <div key={i}>
              <Hero {...attrs} onOpenDrawer={(typeof attrs?.onOpenDrawer === 'function' ? (attrs.onOpenDrawer as () => void) : () => {})} />
            </div>
          );
        if (name.includes('accordion') || name.includes('we-do'))
          return (
            <div key={i}>
              <WhatWeDoAccordion {...attrs} items={Array.isArray(attrs?.items) ? attrs.items : []} />
            </div>
          );
        if (name.includes('cta')) return <div key={i}><CTA {...(b.attributes || {})} /></div>;
        if (name.includes('feature')) return <div key={i}><Features {...(b.attributes || {})} /></div>;
        if (name.includes('image') || name === 'core/image') {
          const attributes = b.attributes as Record<string, unknown>;
          const src = attributes?.url || attributes?.src || undefined;
          return src ? <div key={i}><ResponsiveImage src={String(src)} alt={String(attributes?.alt ?? '')} /></div> : null;
        }

        // html block fallback
        if (b.innerHTML) return <div key={i} dangerouslySetInnerHTML={{ __html: b.innerHTML }} />;

        return <pre key={i} style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(b, null, 2)}</pre>;
      })}
    </>
  );
}


