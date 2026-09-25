import type { Business } from '@/db/runtime';

export const SITE_URL = 'https://whoknowsapro.com';

export function specialtyList(value: string | null) {
  if (!value) return [];
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 20);
}

export function structuredOpeningHours(value: string | null) {
  if (!value) return undefined;
  const values = value.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
  const pattern = /^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))?\s+\d{2}:\d{2}-\d{2}:\d{2}$/;
  const structured = values.filter((item) => pattern.test(item));
  return structured.length ? structured : undefined;
}

export function openingHoursSpecifications(value: string | null) {
  const values = structuredOpeningHours(value);
  if (!values) return undefined;
  const dayOrder = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
  const dayNames: Record<(typeof dayOrder)[number], string> = {
    Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
    Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
  };
  return values.map((schedule) => {
    const match = schedule.match(/^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!match) return null;
    const start = dayOrder.indexOf(match[1] as (typeof dayOrder)[number]);
    const end = dayOrder.indexOf((match[2] || match[1]) as (typeof dayOrder)[number]);
    const dayOfWeek: string[] = [];
    for (let offset = 0; offset < dayOrder.length; offset += 1) {
      const index = (start + offset) % dayOrder.length;
      dayOfWeek.push(dayNames[dayOrder[index]]);
      if (index === end) break;
    }
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek,
      opens: match[3],
      closes: match[4],
    };
  }).filter((item) => item !== null);
}

export function businessMetaDescription(business: Business, category: string, city: string) {
  const description = business.summary.trim();
  if (description) return description.slice(0, 158);
  const details = [
    business.service_area ? `Service area: ${business.service_area}.` : '',
    business.phone ? `Phone: ${business.phone}.` : '',
  ].filter(Boolean).join(' ');
  return `${business.name} is listed for ${category.toLowerCase()} in ${city}. ${details || 'View available contact information and the official website.'}`.slice(0, 160);
}

export function isBusinessProfileIndexable(business: Business) {
  let hasPhotos = false;
  try { hasPhotos = (JSON.parse(business.photo_urls || '[]') as unknown[]).length > 0; } catch {}
  return Boolean(
    business.summary.trim()
    || business.phone
    || business.address
    || business.service_area
    || business.hours
    || business.specialties
    || business.year_founded
    || business.license_number
    || business.logo_url
    || hasPhotos
  );
}

export function businessStructuredJsonLd(business: Business) {
  const openingHours = structuredOpeningHours(business.hours);
  const openingHoursSpecification = openingHoursSpecifications(business.hours);
  return {
    '@context': 'https://schema.org',
    // Google requires a real physical address for LocalBusiness rich results.
    // Addressless service businesses remain valid Organization entities until
    // the owner supplies an address; no address is ever inferred or invented.
    '@type': business.address ? 'LocalBusiness' : 'Organization',
    name: business.name,
    url: `${SITE_URL}/business/${business.main_slug || business.slug}`,
    sameAs: business.website,
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.address ? { address: { '@type': 'PostalAddress', streetAddress: business.address } } : {}),
    ...(business.service_area ? { areaServed: business.service_area } : {}),
    ...(business.address && openingHours ? { openingHours, openingHoursSpecification } : {}),
  };
}
