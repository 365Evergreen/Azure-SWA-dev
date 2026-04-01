export default function ResponsiveImage({ src, alt, className }: { src?: string | null; alt?: string | null; className?: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt ?? ''}
      loading="lazy"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
    />
  );
}
