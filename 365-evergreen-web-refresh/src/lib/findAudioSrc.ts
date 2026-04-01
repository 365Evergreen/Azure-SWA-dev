/**
 * Searches through a post's blocks and content HTML for an audio src URL.
 * Returns the first src found, or null if none exists.
 */
export function findAudioSrc(post: {
  blocks?: Array<{ innerHTML?: string }>;
  content?: string;
} | null): string | null {
  if (!post) return null;

  const htmlSources: string[] = [];

  if (post.blocks && Array.isArray(post.blocks)) {
    for (const b of post.blocks) {
      if (b && typeof b.innerHTML === 'string') htmlSources.push(b.innerHTML);
    }
  }
  if (post.content) htmlSources.push(post.content);

  for (const html of htmlSources) {
    const m = html.match(/<audio[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (m?.[1]) return m[1];
    const m2 = html.match(/<source[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (m2?.[1]) return m2[1];
  }
  return null;
}
