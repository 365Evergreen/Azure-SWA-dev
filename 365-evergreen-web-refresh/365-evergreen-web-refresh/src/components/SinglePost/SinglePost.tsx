import React from 'react';
import * as Router from 'react-router-dom';
import { useBreadcrumb } from '../BreadcrumbContext';
import { useSinglePostBySlug } from '../../lib/useSinglePostBySlug';
import PageBlocks from '../PageBlocks/PageBlocks';
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

  return (
    <section className={styles.singlePostRoot}>
      <h2 className={styles.title}>{post?.title || 'Loading...'}</h2>

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
