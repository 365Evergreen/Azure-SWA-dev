import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@fluentui/react-components';
import { useSinglePostBySlug } from '../../lib/useSinglePostBySlug';
import PageBlocks from '../PageBlocks/PageBlocks';
import styles from './SinglePost.module.css';
import { useParams } from 'react-router-dom';

export const SinglePost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
 

  // Fetch post by slug
  const post = useSinglePostBySlug(slug);

  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    { text: post?.title || slug || 'Post', href: `/post/${slug}` },
  ];

  return (
    <section className={styles.singlePostRoot}>
      <div className={styles.breadcrumbWrap}>
        <Breadcrumb className={styles.breadcrumb}>
          {breadcrumbItems.map((item, idx) => (
            <BreadcrumbItem key={item.href + '-' + idx}>
              {idx < breadcrumbItems.length - 1 ? (
                <>
                  <Link to={item.href}>{item.text}</Link>
                  <span className={styles.separator}>/</span>
                </>
              ) : (
                <span>{item.text}</span>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </div>

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
