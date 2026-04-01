import React from 'react';

export const TestCtaQuery: React.FC = () => {
  const [data, setData] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const query = `{
  cTA(id: "get-your-free-modern-workplace-trial", idType: URI) {
    id
    title
    slug
    blocks
    content
  }
}`;

    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return (
    <section style={{ padding: 20 }}>
      <h2>Test CTA Query</h2>
      <p>URL: <code>/test/cta-query</code></p>
      {loading && <p>Loading…</p>}
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      {data && (
        <div>
          <h3>Raw response</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12 }}>{JSON.stringify(data, null, 2)}</pre>
          <h3>Post content preview</h3>
          <div style={{ border: '1px solid #ddd', padding: 12 }}>
            {data?.data?.cTA ? (
              <>
                <h4>{data.data.cTA.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: data.data.cTA.content || '' }} />
              </>
            ) : (
              <em>No cTA data in response</em>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TestCtaQuery;