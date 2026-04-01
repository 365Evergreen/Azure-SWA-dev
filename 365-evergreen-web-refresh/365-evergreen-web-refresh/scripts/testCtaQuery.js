(async () => {
  try {
    const query = `query GetCtaPost {
  post(id: "/cta/get-your-free-modern-workplace-trial/", idType: URI) {
    title
    slug
    content(format: RENDERED)
    featuredImage { node { sourceUrl } }
  }
}`;
    const res = await fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching GraphQL:', err);
    process.exit(1);
  }
})();