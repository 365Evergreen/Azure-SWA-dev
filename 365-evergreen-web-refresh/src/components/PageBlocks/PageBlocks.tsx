import React from 'react';
import { VanillaAccordion } from '../VanillaAccordion/VanillaAccordion';
import './PageBlocks.module.css';

// Utility to convert absolute URLs to relative
function toLocalUrl(url?: string) {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?365evergreen\.com/, '');
}

type JsonRecord = Record<string, unknown>;

type Block = {
  name: string;
  attributes?: JsonRecord;
  innerHTML?: string;
  innerBlocks?: Block[];
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object';
}

function getAttributes(block: Block): JsonRecord {
  return isRecord(block.attributes) ? (block.attributes as JsonRecord) : {};
}

function getRecordValue(source: JsonRecord | undefined, key: string): JsonRecord | undefined {
  if (!source) return undefined;
  const value = source[key];
  return isRecord(value) ? (value as JsonRecord) : undefined;
}

function getStringValue(source: JsonRecord | undefined, key: string): string | undefined {
  if (!source) return undefined;
  const value = source[key];
  return typeof value === 'string' ? value : undefined;
}

function getNumberValue(source: JsonRecord | undefined, key: string): number | undefined {
  if (!source) return undefined;
  const value = source[key];
  return typeof value === 'number' ? value : undefined;
}

function sanitiseHtml(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toCssProperties(value: JsonRecord | undefined): React.CSSProperties | undefined {
  if (!value) return undefined;
  const entries = Object.entries(value).filter(([, v]) => typeof v === 'string' || typeof v === 'number');
  if (entries.length === 0) {
    return undefined;
  }
  return Object.fromEntries(entries) as React.CSSProperties;
}

interface PageBlocksProps {
  blocks?: Block[];
}


const PageBlocks: React.FC<PageBlocksProps> = ({ blocks }) => {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block, idx) => {
        let content: React.ReactNode = null;
        const attrs = getAttributes(block);
        switch (block.name) {
          case 'core/paragraph':
            content = <p className="fluent-body1" dangerouslySetInnerHTML={{ __html: sanitiseHtml(getStringValue(attrs, 'content') ?? block.innerHTML) }} />;
            break;
          case 'core/heading': {
            const level = getNumberValue(attrs, 'level') ?? 2;
            const tag = `h${level}`;
            if (/^h[1-6]$/.test(tag)) {
              content = React.createElement(tag, {
                className: `fluent-title${level}`,
                dangerouslySetInnerHTML: { __html: sanitiseHtml(getStringValue(attrs, 'content') ?? block.innerHTML) }
              });
            } else {
              content = <h2 className="fluent-title2" dangerouslySetInnerHTML={{ __html: sanitiseHtml(getStringValue(attrs, 'content') ?? block.innerHTML) }} />;
            }
            break;
          }
          case 'core/image': {
            const url = getStringValue(attrs, 'url');
            if (url) {
              const alt = getStringValue(attrs, 'alt');
              content = <img src={url} alt={alt ?? undefined} style={{ maxWidth: '100%', borderRadius: 8 }} />;
            }
            break;
          }
          case 'core/button': {
            const href = getStringValue(attrs, 'url');
            const backgroundColor = getStringValue(attrs, 'backgroundColor') ?? 'black';
            const textColor = getStringValue(attrs, 'textColor') ?? 'white';
            const buttonContent = getStringValue(attrs, 'content') ?? '';

            content = (
              <a
                href={toLocalUrl(href)}
                style={{ display: 'inline-block', padding: '0.5em 1.5em', background: backgroundColor, color: textColor, textDecoration: 'none', fontWeight: 700, borderRadius: 6 }}
              >
                {buttonContent}
              </a>
            );
            break;
          }
          case 'core/navigation-link':
            content = (
              <a href={toLocalUrl(getStringValue(attrs, 'url'))}>{getStringValue(attrs, 'label') ?? 'Learn more'}</a>
            );
            break;
          case 'core/columns': {
            // Render columns as flex row, with background and padding
            const styleRecord = getRecordValue(attrs, 'style');
            const spacingRecord = getRecordValue(styleRecord, 'spacing');
            const padding = getStringValue(spacingRecord, 'padding') ?? '2.5rem 2rem';
            const customStyle = toCssProperties(getRecordValue(styleRecord, 'custom'));
            const backgroundColor = getStringValue(attrs, 'backgroundColor');
            const borderRadius = getStringValue(attrs, 'borderRadius');
            const boxShadow = getStringValue(attrs, 'boxShadow');
            content = (
              <div
                className="wp-columns"
                style={{
                  background: backgroundColor,
                  borderRadius,
                  boxShadow,
                  padding,
                  minHeight: 200,
                  margin: '1.5rem 0',
                  ...(customStyle ?? {}),
                }}
              >
                {block.innerBlocks?.map((col, i) => (
                  <div className="wp-column" key={i} style={{ flex: 1, minWidth: 0 }}>
                    <PageBlocks blocks={[col]} />
                  </div>
                ))}
              </div>
            );
            break;
          }
          case 'core/column':
            // Render column content only
            content = (
              <div className="wp-column">
                {block.innerBlocks && <PageBlocks blocks={block.innerBlocks} />}
              </div>
            );
            break;
          case 'core/group':
          case 'core/template-part':
          case 'core/cover':
          case 'core/post-content':
          case 'core/buttons':
            content = null; // just render children below
            break;
          // Automatically map WP accordion block to VanillaAccordion
          case 'core/accordion': {
            // Map WP block to VanillaAccordionItem structure
            const panels = (block.innerBlocks || []).map(panelBlock => {
              const panelAttrs = getAttributes(panelBlock);
              return {
                title: getStringValue(panelAttrs, 'title') ?? 'Accordion Panel',
                content: sanitiseHtml(getStringValue(panelAttrs, 'content') ?? panelBlock.innerHTML),
              };
            });
            const item = {
              title: getStringValue(attrs, 'title') ?? 'Accordion',
              description: getStringValue(attrs, 'description') ?? '',
              panels,
            };
            content = <VanillaAccordion items={[item]} />;
            break;
          }
          // Add more block types as needed
          default:
            // Fallback: show block name and any raw HTML
            content = (
              <div style={{ border: '1px dashed #ccc', margin: '8px 0', padding: 4 }}>
                <small style={{ color: '#888' }}>{block.name}</small>
                {block.innerHTML && (
                  <div className="fluent-body1" dangerouslySetInnerHTML={{ __html: block.innerHTML }} />
                )}
              </div>
            );
        }
        // Determine if this is a container block that should use background/text color
        const isContainer = [
          'core/group',
          'core/cover',
          'core/columns',
          'core/column',
          'core/template-part',
        ].some(type => block.name.startsWith(type));

        // Compose style for container
        const backgroundColor = getStringValue(attrs, 'backgroundColor');
        const textColor = getStringValue(attrs, 'textColor');
        const borderRadius = getStringValue(attrs, 'borderRadius');
        const containerStyleRecord = getRecordValue(attrs, 'style');
        const containerSpacingRecord = getRecordValue(containerStyleRecord, 'spacing');
        const padding = getStringValue(containerSpacingRecord, 'padding');
        const customStyle = toCssProperties(getRecordValue(containerStyleRecord, 'custom'));
        const overlayColor = getStringValue(attrs, 'overlayColor');
        const hasBgOrOverlay = Boolean(backgroundColor || overlayColor);
        const containerStyle: React.CSSProperties = isContainer
          ? {
              margin: '12px 0',
              background: backgroundColor,
              color: textColor,
              borderRadius,
              padding: padding ?? (hasBgOrOverlay ? '2.5rem 2rem' : undefined),
              minHeight: hasBgOrOverlay ? 200 : undefined,
              display: hasBgOrOverlay ? 'flex' : undefined,
              flexDirection: hasBgOrOverlay ? 'column' : undefined,
              alignItems: hasBgOrOverlay ? 'center' : undefined,
              justifyContent: hasBgOrOverlay ? 'center' : undefined,
              position: undefined, // will be set below if overlay
              ...(customStyle ?? {}),
            }
          : {};

        // Overlay support
        let overlay: React.ReactNode = null;
        if (isContainer && overlayColor) {
          // Accept overlayOpacity as 0-1 or 0-100
          let opacity = 0.5;
          const overlayOpacity = getNumberValue(attrs, 'overlayOpacity');
          if (typeof overlayOpacity === 'number') {
            opacity = overlayOpacity > 1 ? overlayOpacity / 100 : overlayOpacity;
          }
          overlay = (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                background: overlayColor,
                opacity,
                borderRadius,
              }}
              aria-hidden="true"
            />
          );
        }

        return (
          <div
            key={idx}
            className="wp-content"
            style={{
              ...containerStyle,
              position: overlay ? 'relative' : containerStyle.position,
            }}
          >
            {overlay}
            {content}
            {block.innerBlocks && block.innerBlocks.length > 0 && (
              <PageBlocks blocks={block.innerBlocks} />
            )}
          </div>
        );
      })}
    </>
  );
};

export default PageBlocks;


