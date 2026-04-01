import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import heroConfig from '../../../page-components.json';
import { useLatestPosts } from './useLatestPosts';
import { useAllCategories, type WPCategory } from '../../lib/useAllCategories';
import type { LatestPost, CategoryEdge } from './useLatestPosts';
import './LatestPostsArchive.css';



type CategoryGroup = {
	slug: string;
	parent: WPCategory;
	children: WPCategory[];
};

function stripHtml(value: string): string {
	return value.replace(/<[^>]+>/g, ' ');
}

const LatestPostsArchive: React.FC = () => {
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	// Find the hero config for the archive page
	const hero = Array.isArray(heroConfig.body)
		? heroConfig.body.find((b: Record<string, unknown>) => b.page === 'latest-posts')
		: null;

	// Posts and categories
	const posts = useLatestPosts(100);
	const [search, setSearch] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [catDropdownOpen, setCatDropdownOpen] = useState(false);
	const catDropdownRef = useRef<HTMLDivElement>(null);
	const catDropdownSummaryRef = useRef<HTMLDivElement>(null);
	const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 220 });

	// Fetch all categories from WPGraphQL
	const { categories: allCategories } = useAllCategories();
	// Group categories by parent, sort alphabetically, avoid duplicates
	const categories = React.useMemo<CategoryGroup[]>(() => {
		const catMap = new Map<string, WPCategory>();
		allCategories.forEach(cat => catMap.set(cat.id, cat));

		const parentGroups = new Map<string, WPCategory[]>();
		allCategories.forEach(cat => {
			const parentId = cat.parent?.node?.id ?? 'root';
			const group = parentGroups.get(parentId) ?? [];
			group.push(cat);
			parentGroups.set(parentId, group);
		});

		Array.from(parentGroups.values()).forEach(group =>
			group.sort((a, b) => a.name.localeCompare(b.name))
		);

		const result: CategoryGroup[] = [];
		(parentGroups.get('root') ?? []).forEach(parentCat => {
			const children = parentGroups.get(parentCat.id) ?? [];
			result.push({ slug: parentCat.slug, parent: parentCat, children });
		});

		parentGroups.forEach((group, parentId) => {
			if (parentId === 'root' || catMap.has(parentId)) {
				return;
			}
			group.forEach(cat => {
				result.push({ slug: cat.slug, parent: cat, children: [] });
			});
		});

		return result;
	}, [allCategories]);

	const parentSlugByChildSlug = React.useMemo(() => {
		const map = new Map<string, string>();
		categories.forEach(({ parent, children }) => {
			children.forEach(child => {
				if (child.slug) {
					map.set(child.slug, parent.slug);
				}
			});
		});
		return map;
	}, [categories]);

	const filteredPosts = React.useMemo(() => {
		const searchTerm = search.trim().toLowerCase();
		const selectedSet = new Set(selectedCategories.filter(Boolean));

		return posts.filter(post => {
			const combinedText = `${post.title ?? ''} ${stripHtml(post.excerpt ?? '')}`.toLowerCase();
			const matchesSearch = searchTerm.length === 0 || combinedText.includes(searchTerm);
			if (!matchesSearch) {
				return false;
			}

			if (selectedSet.size === 0) {
				return true;
			}

			const edges = post.categories?.edges ?? [];
			if (edges.length === 0) {
				return false;
			}

			return edges.some(edge => {
				const slug = edge?.node?.slug;
				if (!slug) {
					return false;
				}
				if (selectedSet.has(slug)) {
					return true;
				}
				const parentSlug = parentSlugByChildSlug.get(slug);
				return parentSlug ? selectedSet.has(parentSlug) : false;
			});
		});
	}, [posts, search, selectedCategories, parentSlugByChildSlug]);

	const visiblePosts = React.useMemo(() => {
		const limit = viewMode === 'grid' ? 15 : 15;
		return filteredPosts.slice(0, limit);
	}, [filteredPosts, viewMode]);

	// Close dropdown on outside click
	useEffect(() => {
		if (!catDropdownOpen) return;
		function handleClick(e: MouseEvent) {
			if (
				catDropdownRef.current &&
				!catDropdownRef.current.contains(e.target as Node) &&
				catDropdownSummaryRef.current &&
				!catDropdownSummaryRef.current.contains(e.target as Node)
			) {
				setCatDropdownOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClick);

		// Position dropdown
		if (catDropdownSummaryRef.current) {
			const rect = catDropdownSummaryRef.current.getBoundingClientRect();
			setDropdownPos({
				top: rect.bottom + window.scrollY + 4,
				left: rect.left + window.scrollX,
				width: rect.width
			});
		}

		return () => document.removeEventListener('mousedown', handleClick);
	}, [catDropdownOpen]);

	if (!hero) {
		return null;
	}

	return (<>
		   <section
			   className="hero-root-archive"
			   style={{
				   background: hero.backgroundImage
					   ? `url(${hero.backgroundImage}) center/cover no-repeat, ${hero.backgroundColour || '#222'}`
					   : hero.backgroundColour || '#222',
			   }}
		   >			   <div className="hero-gradient-archive" aria-hidden="true"></div>

			   <div className="hero-content-archive"
			>
				   <h1 className="hero-title-archive">
					{hero.title}
				</h1>
				   {hero.blurb && (
					   <p className="hero-desc-archive">
						   {hero.blurb}
					   </p>
				   )}
				   <div className="latest-posts-archive-filters-row">
					{/* Search box */}
					   <div className="latest-posts-archive-filter-group">
						   <input
							   type="text"
							   className="latest-posts-archive-searchbox"
							   placeholder="Search posts..."
							   value={search}
							   onChange={e => setSearch(e.target.value)}
						   />
					   </div>
					{/* Category multi-select dropdown */}
					   <div className="latest-posts-archive-filter-group latest-posts-archive-category-group">
						   <div
							   ref={catDropdownSummaryRef}
							   className="latest-posts-archive-category-select"
							   tabIndex={0}
							   onClick={() => setCatDropdownOpen(v => !v)}
							   aria-haspopup="listbox"
							   aria-expanded={catDropdownOpen}
						   >
							   <span className="latest-posts-archive-category-select-label">
								   {selectedCategories.length === 0
									   ? 'All categories'
									   : `${selectedCategories.length} selected`}
							   </span>
							   <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="latest-posts-archive-category-select-arrow">
								   <path d="M6 8L10 12L14 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							   </svg>
						   </div>
						{catDropdownOpen && typeof window !== 'undefined' && ReactDOM.createPortal(
							<div
								ref={catDropdownRef}
								className="latest-posts-archive-category-dropdown"
								   style={{
									   position: 'absolute',
									   top: dropdownPos.top,
									   left: dropdownPos.left,
									   minWidth: dropdownPos.width,
								   }}
								tabIndex={-1}
								role="listbox"
							>
								{/* Render all categories, children nested under parents */}
								{categories.map(({ parent, children }) => (
									<div key={parent.id} className="latest-posts-archive-category-parent-group">
										<label
											className={`latest-posts-archive-category-option${selectedCategories.includes(parent.slug) ? ' selected' : ''}`}
										>
											<input
												type="checkbox"
												checked={selectedCategories.includes(parent.slug)}
												onChange={e => {
													setSelectedCategories(prev =>
														e.target.checked
															? [...prev, parent.slug]
															: prev.filter(s => s !== parent.slug)
													);
												}}
											/>
											{parent.name}
										</label>
										{children.length > 0 && (
											<div style={{ paddingLeft: 18 }}>
												{children.map(child => (
													<label
														key={child.id}
														className={`latest-posts-archive-category-option${selectedCategories.includes(child.slug) ? ' selected' : ''}`}
													>
														<input
															type="checkbox"
															checked={selectedCategories.includes(child.slug)}
															onChange={e => {
																setSelectedCategories(prev =>
																	e.target.checked
																		? [...prev, child.slug]
																		: prev.filter(s => s !== child.slug)
																);
															}}
														/>
														{child.name}
													</label>
												))}
											</div>
										)}
									</div>
								))}
							</div>,
							document.body
						)}
					</div>
					{/* Clear filters button */}
				   <div className="latest-posts-archive-filter-group">
					   <button
					   	type="button"
					   	className="latest-posts-archive-clear-filters"
					   	onClick={() => { setSearch(''); setSelectedCategories([]); }}
					   >
					   	<svg
					   		width="16"
					   		height="16"
					   		viewBox="0 0 16 16"
					   		fill="none"
					   		xmlns="http://www.w3.org/2000/svg"
					   		aria-hidden="true"
					   	>
					   		<path
					   			d="M3 4.5H13"
					   			stroke="currentColor"
					   			strokeWidth="1.5"
					   			strokeLinecap="round"
					   			strokeLinejoin="round"
					   		/>
					   		<path
					   			d="M5.5 4.5V11.25C5.5 11.8023 5.94772 12.25 6.5 12.25H9.5C10.0523 12.25 10.5 11.8023 10.5 11.25V4.5"
					   			stroke="currentColor"
					   			strokeWidth="1.5"
					   			strokeLinecap="round"
					   			strokeLinejoin="round"
					   		/>
					   		<path
					   			d="M7 6.5V10"
					   			stroke="currentColor"
					   			strokeWidth="1.5"
					   			strokeLinecap="round"
					   			strokeLinejoin="round"
					   		/>
					   		<path
					   			d="M9 6.5V10"
					   			stroke="currentColor"
					   			strokeWidth="1.5"
					   			strokeLinecap="round"
					   			strokeLinejoin="round"
					   		/>
					   	</svg>
					   	Clear filters
					   </button>
				   </div>
				   {/* Removed selected category tags from hero section */}
			</div>
		</div></section>
		   {/* Archive options row: tags and view toggle */}
		   <div className="archive-options">
			   <div className="archive-options-tags">
				   {selectedCategories.length > 0 && (
					   <div className="latest-posts-archive-category-tags">
						   {selectedCategories.filter(slug => !!slug).map(slug => {
							   // Find the category object by searching parents and children only
							   let cat: import("../../lib/useAllCategories").WPCategory | null = null;
							   for (const group of categories) {
								   if (group.parent && group.parent.slug === slug) {
									   cat = group.parent;
									   break;
								   }
								   if (group.children && group.children.length > 0) {
									   const child = group.children.find(child => child.slug === slug);
									   if (child) {
										   cat = child;
										   break;
									   }
								   }
							   }
							   if (!cat || !cat.slug) return null;
							   return (
								   <span key={cat.slug} className="latest-posts-archive-category-tag">
									   {cat.name}
									   <button
										   onClick={e => {
											   e.stopPropagation();
											   setSelectedCategories(prev => prev.filter(s => s !== slug));
										   }}
										   className="latest-posts-archive-category-tag-remove"
										   aria-label={`Remove ${cat.name}`}
										   tabIndex={0}
									   >
										   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
											   <line x1="4" y1="4" x2="10" y2="10" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round" />
											   <line x1="10" y1="4" x2="4" y2="10" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round" />
										   </svg>
									   </button>
								   </span>
							   );
						   })}
					   </div>
				   )}
			   </div>
							 <div className="archive-options-toggle desktop-only">
									 <button
											 type="button"
											 className="archive-view-toggle"
											 onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
											 aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
									 >
											 <img
												 src={viewMode === 'grid'
													 ? 'https://365evergreen.com/wp-content/uploads/2026/01/ic_fluent_apps_list_24_regular-1.png'
													 : 'https://365evergreen.com/wp-content/uploads/2026/01/ic_fluent_grid_24_regular-1.png'}
												 alt={viewMode === 'grid' ? 'List view icon' : 'Grid view icon'}
												 width={22}
												 height={22}
												 className="archive-view-toggle-icon"
											 />
											 {viewMode === 'grid' ? 'List View' : 'Grid View'}
									 </button>
							 </div>
		 </div>

		 {/* Posts container: grid or list view */}
		 <div className={viewMode === 'grid' ? 'latest-posts-archive-grid' : 'latest-posts-archive-list'}>
				{visiblePosts.map((post: LatestPost) => {
				 if (viewMode === 'grid') {
					 const primaryCategory = post.categories?.edges?.[0]?.node?.slug || 'post';
					 const postUrl = `/category/${primaryCategory}/${post.slug}`;
					 return (
						 <div
							 key={post.id}
							 className="latest-posts-archive-card selectable-card"
							 style={{ cursor: 'pointer' }}
							 onClick={() => window.location.href = postUrl}
						 >
							 <span className="latest-posts-title-link fluent-title3" style={{ color: '#000', marginBottom: '0.5rem', display: 'block' }}>{post.title}</span>
							 {post.featuredImage?.node?.sourceUrl && (
								 <span className="latest-posts-image-link">
									 <img
										 src={post.featuredImage.node.sourceUrl}
										 alt={post.title}
										 className="latest-posts-featured-image"
										 loading="lazy"
									 />
								 </span>
							 )}
							 {(post.categories?.edges?.length ?? 0) > 0 && (
								 <div style={{ marginBottom: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
									 {(post.categories?.edges ?? []).map((catEdge: CategoryEdge) => {
									 	const category = catEdge?.node;
									 	if (!category) {
									 		return null;
									 	}
									 	return (
									 		<span
									 			key={category.slug}
									 			className="latest-posts-category-tag"
											 style={{
												 background: '#e6f2e6',
												 color: '#2d6a2d',
												 fontSize: '0.85em',
												 borderRadius: '6px',
												 padding: '0.15em 0.7em',
												 cursor: 'pointer',
											 }}
											 onClick={e => {
												 e.stopPropagation();
									 			window.location.href = `/category/${category.slug}`;
											 }}
										 >
									 		 {category.name}
									 	</span>
									 	);
									 })}
								 </div>
							 )}
							 <div className="latest-posts-date">{new Date(post.date).toLocaleDateString()}</div>
							 <p className="latest-posts-excerpt">{post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '').slice(0, 175) + (post.excerpt.length > 175 ? '…' : '') : ''}</p>
							 <a
								 href={postUrl}
								 className="latest-posts-archive-link"
								 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', fontWeight: 600, color: '#111', textDecoration: 'none', marginTop: '0.5em' }}
								 onClick={e => {
									 e.stopPropagation();
									 e.preventDefault();
									 window.location.href = postUrl;
								 }}
								 tabIndex={0}
							 >
								 Read more
								 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0.1em' }}>
									 <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								 </svg>
							 </a>
						 </div>
					 );
				 }
				 // List view fallback (add excerpt)
				 return (
					 <div key={post.id} className="latest-posts-archive-card">
						 <h3>{post.title}</h3>
						 <p className="latest-posts-excerpt">{post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '').slice(0, 175) + (post.excerpt.length > 175 ? '…' : '') : ''}</p>
					 </div>
				 );
			 })}
		 </div>

		 </>
		 );

};

export default LatestPostsArchive;

