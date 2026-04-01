import React, { useEffect, useState } from 'react';

type EditorBlock = {
  apiVersion?: string;
  blockEditorCategoryName?: string;
  clientId?: string;
  name?: string;
  parentClientId?: string;
  renderedHtml?: string;
  type?: string;
};

type PageResult = {
  content?: string;
  editorBlocks?: EditorBlock[];
  slug?: string;
  title?: string;
  uri?: string;
};

const QUERY = `query MyQuery3 {\n  page(id: "cG9zdDoxNA==") {\n    content(format: RENDERED)\n    editorBlocks {\n      apiVersion\n      blockEditorCategoryName\n      clientId\n      name\n      parentClientId\n      renderedHtml\n      type\n    }\n    slug\n    title(format: RENDERED)\n    uri\n  }\n}`;

const TestPageQuery: React.FC = () => {
  const [data, setData] = useState<PageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch('https://365evergreendev.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: QUERY }),
        });
        const json = await resp.json();
        if (cancelled) return;
        const node = json?.data?.page;
        if (!node) {
          setError('No page returned from GraphQL');
          setData(null);
        } else {
          setData({
            content: node.content || '',
            editorBlocks: node.editorBlocks || [],
            slug: node.slug || '',
            title: node.title || '',
            uri: node.uri || '',
          });
        }
      } catch (err: any) {
        setError(String(err?.message || err));
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div>Loading test page query…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <section style={{ padding: 20 }}>
      <h1 dangerouslySetInnerHTML={{ __html: data.title || 'Untitled' }} />
      <p><strong>Slug:</strong> {data.slug}</p>
      <p><strong>URI:</strong> {data.uri}</p>
      <div>
        <h2>Rendered Content</h2>
        <div dangerouslySetInnerHTML={{ __html: data.content || '' }} />
      </div>
      <div style={{ marginTop: 20 }}>
        <h2>Editor Blocks</h2>
        {Array.isArray(data.editorBlocks) && data.editorBlocks.length > 0 ? (
          data.editorBlocks.map((b, i) => (
            <div key={b.clientId || i} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
              <div><strong>Type:</strong> {b.type}</div>
              <div><strong>Name:</strong> {b.name}</div>
              <div><strong>ClientId:</strong> {b.clientId}</div>
              <div style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: b.renderedHtml || '' }} />
            </div>
          ))
        ) : (
          <div>No editor blocks returned.</div>
        )}
      </div>
    </section>
  );
};

export default TestPageQuery;
