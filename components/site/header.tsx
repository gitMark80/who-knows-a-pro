import { BadgeCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
      <a href="/" className="flex items-center gap-2.5" aria-label="Who Knows a Pro home">
        <span className="grid size-10 place-items-center rounded-xl bg-[#142c4c] text-white shadow-sm"><BadgeCheck className="size-5"/></span>
        <span className="text-[1.08rem] font-black tracking-[-.04em] text-[#142c4c]">WHO KNOWS A PRO<span className="text-[#ec7d2c]">?</span></span>
      </a>
      <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex" aria-label="Main navigation">
        <a href="/#find" className="hover:text-[#142c4c]">Find a pro</a>
        <a href="/#regions" className="hover:text-[#142c4c]">Browse regions</a>
        <a href="/claim" className="hover:text-[#142c4c]">For businesses</a>
      </nav>
      <div className="flex gap-2">
        <Button asChild variant="ghost" className="hidden sm:inline-flex"><a href="/claim">Claim your business</a></Button>
        <Button asChild className="bg-[#ec7d2c] text-white hover:bg-[#d96c20]"><a href="/#find"><Search className="size-4"/>Find a pro</a></Button>
      </div>
    </div>
  </header>;
}
