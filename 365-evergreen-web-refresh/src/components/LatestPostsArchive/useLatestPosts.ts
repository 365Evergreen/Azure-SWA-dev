import { useEffect, useState } from 'react';

type Maybe<T> = T | null | undefined;

export interface CategoryNode {
	id: string;
	name: string;
	slug: string;
}

export interface CategoryEdge {
	node: CategoryNode | null;
}

export interface CategoryConnection {
	edges: CategoryEdge[];
}

export interface LatestPost {
	id: string;
	title: string;
	date: string;
	slug: string;
	excerpt: string;
	content?: string;
	featuredImage?: { node: { sourceUrl: string } };
	categories?: CategoryConnection;
}

interface GraphQLCategoryNode {
	id?: unknown;
	name?: unknown;
	slug?: unknown;
}

interface GraphQLPostNode {
	id?: unknown;
	title?: unknown;
	date?: unknown;
	slug?: unknown;
	excerpt?: unknown;
	content?: unknown;
	featuredImage?: { node?: { sourceUrl?: unknown } | null } | null;
	categories?: { edges?: Array<{ node?: GraphQLCategoryNode | null } | null> | null } | null;
}

interface GraphQLResponse {
	data?: {
		posts?: {
			edges?: Array<{ node?: GraphQLPostNode | null } | null>;
		} | null;
	} | null;
}

function toCategoryNode(node: Maybe<GraphQLCategoryNode>): CategoryNode | null {
	if (!node || typeof node !== 'object') {
		return null;
	}
	const id = typeof node.id === 'string' ? node.id : null;
	const name = typeof node.name === 'string' ? node.name : null;
	const slug = typeof node.slug === 'string' ? node.slug : null;
	if (!id || !name || !slug) {
		return null;
	}
	return { id, name, slug };
}

function toLatestPost(node: Maybe<GraphQLPostNode>): LatestPost | null {
	if (!node || typeof node !== 'object') {
		return null;
	}

	const idValue = node.id;
	if (typeof idValue !== 'string' && typeof idValue !== 'number') {
		return null;
	}

	const title = typeof node.title === 'string' ? node.title : '';
	const date = typeof node.date === 'string' ? node.date : '';
	const slug = typeof node.slug === 'string' ? node.slug : '';
	const excerpt = typeof node.excerpt === 'string' ? node.excerpt : '';
	const content = typeof node.content === 'string' ? node.content : undefined;
	const sourceUrl = typeof node.featuredImage?.node?.sourceUrl === 'string'
		? node.featuredImage.node.sourceUrl
		: null;

	const categoryEdges = (node.categories?.edges ?? [])
		.map(edge => toCategoryNode(edge?.node))
		.filter((category): category is CategoryNode => Boolean(category))
		.map(category => ({ node: category }));

	const featuredImage = sourceUrl ? { node: { sourceUrl } } : undefined;
	const categories = categoryEdges.length > 0 ? { edges: categoryEdges } : undefined;

	return {
		id: typeof idValue === 'string' ? idValue : String(idValue),
		title,
		date,
		slug,
		excerpt,
		content,
		featuredImage,
		categories,
	} satisfies LatestPost;
}

export function useLatestPosts(limit: number = 100): LatestPost[] {
	const [posts, setPosts] = useState<LatestPost[]>([]);

	useEffect(() => {
		let isActive = true;

		fetch('https://365evergreendev.com/graphql', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: `query allPosts {\n  posts(first: ${limit}, where: {orderby: {field: DATE, order: DESC}}) {\n    edges {\n      node {\n        id\n        title\n        date\n        excerpt\n        content(format: RENDERED)\n        featuredImage { node { sourceUrl } }\n        slug\n        categories { edges { node { id name slug } } }\n      }\n    }\n  }\n}`
			})
		})
			.then(async res => {
				if (!res.ok) {
					throw new Error('Failed to fetch posts');
				}
				const json = (await res.json()) as GraphQLResponse;
				const edges = json.data?.posts?.edges ?? [];
				const normalized = edges
					.map(edge => toLatestPost(edge?.node))
					.filter((post): post is LatestPost => Boolean(post));

				if (!isActive) {
					return;
				}
				setPosts(normalized);
			})
			.catch(error => {
				if (!isActive) {
					return;
				}
				
				console.error('Failed to fetch posts from WPGraphQL:', error);
				setPosts([]);
			});

		return () => {
			isActive = false;
		};
	}, [limit]);

	return posts;
}



