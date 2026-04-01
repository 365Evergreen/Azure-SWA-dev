
import React from 'react';
import styles from './LatestPosts.module.css';
import { useLatestPosts } from '../../lib/useLatestPosts';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
    };
  };
  categories?: {
    edges: Array<{
      node: {
        slug: string;
        name: string;
      };
    }>;
  };
}

const LatestPosts: React.FC = () => {
  const posts = useLatestPosts(6);
  const navigate = useNavigate();

  // Sort by date descending (should already be, but ensure)
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function getExcerpt(post: Post) {
    // If WPGraphQL returns an excerpt, use it. Otherwise, use the first 175 chars of the title as fallback.
    // If content is available, prefer that.
    const content = post.excerpt || post.content || '';
    if (content) {
      // Remove HTML tags if present
      const text = content.replace(/<[^>]+>/g, '');
      return text.length > 175 ? text.slice(0, 175) + '…' : text;
    }
    return post.title.length > 175 ? post.title.slice(0, 175) + '…' : post.title;
  }

  return (
    <div className={styles.latestPostsOuter}>
      <section className={`${styles.latestPostsRoot} home-section`}>
        <div className={styles.latestPostsContainer}>
          <h2 className={`${styles.latestPostsTitle} fluent-title2 home-section-heading`}>Latest by 365 Evergreen</h2>
          <div className={styles.postsGrid}>
            {sortedPosts.map((post) => {
              const primaryCategory = post.categories?.edges?.[0]?.node?.slug || 'post';
              const postUrl = `/latest-posts/${primaryCategory}/${post.slug}`;
              return (
                <a
                  key={post.id}
                  href={postUrl}
                  className={`${styles.postCard} selectable-card`}
                  onClick={e => { e.preventDefault(); navigate(postUrl); }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(postUrl); } }}
                >
                  <span className={`${styles.latestPostsTitleLink} fluent-title3`}>{post.title}</span>
                  {post.featuredImage?.node?.sourceUrl && (
                    <span className={styles.latestPostsImageLink}>
                      <img
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        className={styles.latestPostsFeaturedImage}
                        loading="lazy"
                      />
                    </span>
                  )}
                  {/* Category tags */}
                  {(post.categories?.edges?.length ?? 0) > 0 && (
                    <div className={styles.categoriesWrap}>
                      {(post.categories?.edges ?? []).map((cat: { node: { slug: string; name: string } }) => (
                            <span
                              key={cat.node.slug}
                              className={styles.latestPostsCategoryTag}
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/category/${cat.node.slug}`);
                              }}
                            >
                              {cat.node.name}
                            </span>
                          ))}
                    </div>
                  )}
                  <div className={styles.latestPostsDate}>{new Date(post.date).toLocaleDateString()}</div>
                  <p className={styles.latestPostsExcerpt}>{getExcerpt(post)}</p>
                  <span className={styles.readMoreLink} tabIndex={0} aria-hidden>
                    Read more
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.readMoreIcon}>
                      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LatestPosts;
