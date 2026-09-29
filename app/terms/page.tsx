import type { Metadata } from 'next';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using the Who Knows a Pro directory and its paid listing plans.',
  alternates: { canonical: '/terms' },
};

const updated = 'September 29, 2026';

export default function TermsPage() {
  return <><Header/><main className="bg-[#f5f7fa]">
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-[#142c4c]">Terms of Use</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated {updated}</p>
      <div className="mt-8 space-y-6 leading-7 text-slate-700">
        <p>Who Knows a Pro is a local business directory operated by Restless Faith Media LLC. By using the site you agree to these terms.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Directory information</h2>
        <p>Listings are informational and are not endorsements or recommendations. We do not verify licensing, insurance, pricing, or availability. Confirm these directly with any business before hiring. We are not a party to any agreement between you and a listed business, and we are not responsible for the work, quality, or conduct of any business.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Quote requests</h2>
        <p>Submitting a quote request allows us and the Featured business on that page, if any, to contact you about your request. Provide accurate information and do not submit requests for any unlawful purpose.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Claiming a profile</h2>
        <p>You may claim a profile only if you are authorized to act for that business. Content you add must be accurate, must not infringe anyone’s rights, and must not be misleading. We may edit or remove content or profiles at our discretion.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Paid plans</h2>
        <p>Enhanced ($29/month) and Featured ($99/month) plans are billed monthly through Stripe Checkout and renew until canceled. You can manage or cancel from your business dashboard. Featured placement is exclusive to one business per city and category page and is subject to availability. We do not guarantee any number of views, leads, or customers.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Acceptable use</h2>
        <p>Do not scrape the site at scale, attempt to disrupt it, submit spam or fraudulent requests, or misuse another business’s profile.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Disclaimers and limits</h2>
        <p>The site is provided “as is” without warranties. To the fullest extent permitted by law, we are not liable for indirect or consequential damages arising from your use of the site or dealings with any listed business.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Corrections and removal</h2>
        <p>To correct or remove a listing, email <a className="font-semibold text-[#d96c20] underline" href="mailto:hello@whoknowsapro.com">hello@whoknowsapro.com</a>. See also our <a className="font-semibold text-[#d96c20] underline" href="/privacy">Privacy Policy</a>.</p>
      </div>
    </article>
  </main><Footer/></>;
}
