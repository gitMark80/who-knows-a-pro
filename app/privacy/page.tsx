import type { Metadata } from 'next';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Who Knows a Pro collects, uses, and protects information from consumers and business owners.',
  alternates: { canonical: '/privacy' },
};

const updated = 'September 29, 2026';

export default function PrivacyPage() {
  return <><Header/><main className="bg-[#f5f7fa]">
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-[#142c4c]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated {updated}</p>
      <div className="mt-8 space-y-6 leading-7 text-slate-700">
        <p>Who Knows a Pro (“we,” “us”) is a local business directory operated by Restless Faith Media LLC. This policy explains what information we collect and how we use it.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Information from people requesting quotes</h2>
        <p>When you submit a quote request, we collect your name, email, phone number, ZIP code, a description of the job, and your preferred contact method. We share this information only with the Featured business on the page you submitted from, if one is active. If no Featured business is active, the request is held by us and is not sent to any other business. We do not sell your information and we do not send it to third-party lead networks.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Information from business owners</h2>
        <p>When a business claims a profile or subscribes to a plan, we collect the contact details and profile content you provide, such as business name, description, logo, and photos. Payments are handled by Stripe. We never see or store your full card number.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Public business listings</h2>
        <p>Many listings are compiled from publicly available business information, such as a business name, category, service area, and official website. Listings are informational and are not endorsements. See “Correcting or removing a listing” below.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Analytics and cookies</h2>
        <p>We use privacy-conscious analytics to understand how the site is used, and we count profile views and outbound website clicks so businesses can see results. Business owners who sign in use a session cookie to stay signed in.</p>

        <h2 className="text-xl font-black text-[#142c4c]">How we use information</h2>
        <p>We use information to operate the directory, route quote requests, process claims and payments, prevent abuse and spam, send service emails, and improve the site.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Retention and your choices</h2>
        <p>We keep quote requests and account records only as long as needed for the purposes above or as required by law. You can ask us to access, correct, or delete information you submitted by emailing the address below.</p>

        <h2 id="remove" className="text-xl font-black text-[#142c4c]">Correcting or removing a listing</h2>
        <p>If you own a listed business, you can claim it for free to update it. To request a correction or removal of a listing, email <a className="font-semibold text-[#d96c20] underline" href="mailto:hello@whoknowsapro.com">hello@whoknowsapro.com</a> with the business name and page URL.</p>

        <h2 className="text-xl font-black text-[#142c4c]">Contact</h2>
        <p>Questions about this policy: <a className="font-semibold text-[#d96c20] underline" href="mailto:hello@whoknowsapro.com">hello@whoknowsapro.com</a>.</p>
      </div>
    </article>
  </main><Footer/></>;
}
