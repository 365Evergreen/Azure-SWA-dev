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
    { text: 'Latest posts', href: '/latest-posts' },
    ...(post?.categories && post.categories.length > 0 ? [{ text: post.categories[0].name, href: `/category/${post.categories[0].slug}` }] : []),
    { text: post?.title || slug || 'Post', href: `/post/${slug}` },
  ];

  const { setItems } = useBreadcrumb();

  React.useEffect(() => {
    setItems(breadcrumbItems);
    return () => setItems([]);
  }, [setItems, post?.title, slug]);

  return (
    <section className={styles.singlePostRoot}>

      <h2 className={styles.title}>{post?.title || 'Loading...'}</h2>
      <BreadcrumbBar />
      <div className={styles.audioWrap}><AudioPlayer src="#" /></div>

      <div className={styles.contentWrap}>
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
