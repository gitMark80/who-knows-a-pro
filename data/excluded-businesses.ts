/**
 * National franchises and big-box chains that are not shown in the directory.
 * They rarely buy local placement and dilute the local-pro focus of the site.
 * Matching is by website host (the domain or any subdomain of it).
 * To bring one back, delete its line here. Unclaimed database rows hidden by
 * ensureDatabase() are restored by setting approved = 1 again.
 */
export const excludedWebsiteDomains = [
  '1800gotjunk.com',
  '911restoration.com',
  'acehandymanservices.com',
  'asppoolco.com',
  'belfor.com',
  'bluehaven.com',
  'certapro.com',
  'chemdryacadiana.com',
  'chemdrynona.com',
  'christopherschemdry.com',
  'huntsvillechemdry.com',
  'fivestarpainting.com',
  'floorcoveringsinternational.com',
  'gerbercollision.com',
  'ibpmiami.com',
  'ibppanhandle.com',
  'ibptampa.com',
  'ibpwestpalm.com',
  'koalainsulation.com',
  'lowes.com',
  'maidpro.com',
  'marinemax.com',
  'mollymaid.com',
  'mrappliance.com',
  'mrhandyman.com',
  'orkin.com',
  'pauldavis.com',
  'pensacolabenjaminfranklin.com',
  'puroclean.com',
  'restoration1.com',
  'restoration1jacksonville.com',
  'rotorooter.com',
  'screenmobile.com',
  'searshomeservices.com',
  'servpro.com',
  'stanleysteemer.com',
  'tintworld.com',
  'twomenandatruck.com',
  'walmart.com',
  'emco-restore.com',
  'mrfenceflorida.com',
  'mrfencepensacola.com',
  'pella.com',
  'trulynolen.com',
  'windowworldpensacola.com',
  'windowworldriverregion.com',
  'windowworldsouthernms.com',
  'windowworldtampa.com',
] as const;

function hostOf(website: string) {
  try {
    return new URL(website).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return website.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export function isExcludedWebsite(website: string | null | undefined): boolean {
  if (!website) return false;
  const host = hostOf(website);
  return excludedWebsiteDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}
