import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
    <ol className="flex flex-wrap items-center gap-1.5">
      {items.map((item, index) => <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
        {index > 0 ? <ChevronRight aria-hidden="true" className="size-3.5 text-slate-400"/> : null}
        {item.href ? <a href={item.href} className="font-semibold hover:text-[#d96c20] hover:underline">{item.label}</a> : <span aria-current="page">{item.label}</span>}
      </li>)}
    </ol>
  </nav>;
}
