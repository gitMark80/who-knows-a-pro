type JsonLdValue = Record<string, unknown> | readonly Record<string, unknown>[];

export function JsonLd({ id, data }: { id: string; data: JsonLdValue }) {
  return <script
    id={id}
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />;
}
