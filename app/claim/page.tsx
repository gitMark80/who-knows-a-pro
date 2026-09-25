import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ClaimBridge({
  searchParams,
}: {
  searchParams: Promise<{
    business?: string | string[];
    region?: string | string[];
    trade?: string | string[];
  }>;
}) {
  const input = await searchParams;
  const target = new URL('https://whoknowsapro.com/claim');
  for (const key of ['business', 'region', 'trade'] as const) {
    const value = input[key];
    if (typeof value === 'string') target.searchParams.set(key, value);
  }
  redirect(target.toString());
}
