import React from 'react';
import * as Router from 'react-router-dom';
import { useBreadcrumb, BreadcrumbBar } from '../BreadcrumbContext';
import { useSinglePostBySlug } from '../../lib/useSinglePostBySlug';
import PageBlocks from '../PageBlocks/PageBlocks';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import styles from './SinglePost.module.css';


export const SinglePost: React.FC = () => {
  const { slug } = Router.useParams<{ slug: string }>();
 

  // Fetch post by slug
  const post = useSinglePostBySlug(slug);

  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    { text: post?.title || slug || 'Post', href: `/post/${slug}` },
  ];

  const { setItems } = useBreadcrumb();

  React.useEffect(() => {
    setItems(breadcrumbItems);
    return () => setItems([]);
  }, [setItems, post?.title, slug]);

  // Try to find an audio src inside post blocks or content
  const findAudioSrc = (): string | null => {
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
      if (m && m[1]) return m[1];
      const m2 = html.match(/<source[^>]*src=["']([^"']+)["'][^>]*>/i);
      if (m2 && m2[1]) return m2[1];
    }
    return null;
  };

  const audioSrc = findAudioSrc();

  return (
    <section className={styles.singlePostRoot}>
    
      <h2 className={styles.title}>{post?.title || 'Loading...'}</h2>
      {audioSrc && <div className={styles.audioWrap}><AudioPlayer src={audioSrc} /></div>}

      <div className={styles.contentWrap}> 
         <BreadcrumbBar />
        {post ? (
          post.blocks && post.blocks.length > 0 ? (
            <PageBlocks blocks={post.blocks} />
          ) : post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <em>No content found…</em>
          )
        ) : (
          <em>Loading content…</em>
        )}
      </div>
    </section>
  );
};

export default SinglePost;
