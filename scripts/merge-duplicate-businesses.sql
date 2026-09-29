-- REVIEW BEFORE RUNNING. Not executed by any deploy step.
-- Merges name-variant duplicates into one canonical profile by pointing main_slug at the
-- canonical slug. Old profile URLs keep working because /business/[slug] looks up
-- "slug OR main_slug". Take a database backup first, and run the SELECT at the bottom
-- to confirm the groups look right before the UPDATEs.
--
-- Existing rows keep their stored main_slug (upserts use COALESCE), so changing the seed
-- data alone does not merge rows that are already in the database.

UPDATE businesses SET main_slug = 'perdido-heating-air'                       WHERE COALESCE(main_slug, slug) = 'perdido-heating-and-air';
UPDATE businesses SET main_slug = 'horizon-concrete'                          WHERE COALESCE(main_slug, slug) = 'horizon-concrete-llc';
UPDATE businesses SET main_slug = 'jones-roofing'                             WHERE COALESCE(main_slug, slug) = 'jones-roofing-inc';
UPDATE businesses SET main_slug = 'mitchell-fence'                            WHERE COALESCE(main_slug, slug) = 'mitchell-fence-company';
UPDATE businesses SET main_slug = 'pace-septic'                               WHERE COALESCE(main_slug, slug) = 'pace-septic-service';
UPDATE businesses SET main_slug = 'r-d-plumbing-co'                           WHERE COALESCE(main_slug, slug) = 'r-d-plumbing-co-llc';
UPDATE businesses SET main_slug = 'robert-s-painting'                         WHERE COALESCE(main_slug, slug) = 'robert-s-painting-llc';
UPDATE businesses SET main_slug = 'taurus-electrical'                         WHERE COALESCE(main_slug, slug) = 'taurus-electrical-llc';
UPDATE businesses SET main_slug = 'storm-force-hurricane-shutters'            WHERE COALESCE(main_slug, slug) = 'storm-force-shutter-solutions';
UPDATE businesses SET main_slug = 'a-cut-above-landscaping'                   WHERE COALESCE(main_slug, slug) = 'a-cut-above-landscaping-and-property-maintenance';
UPDATE businesses SET main_slug = 'advantage-hvac-plumbing-electrical'        WHERE COALESCE(main_slug, slug) = 'advantage-hvac-plumbing-and-electrical';

-- Check: groups that still share a website but have different main_slugs (franchise
-- locations are expected here; look for name variants of one business).
SELECT website, GROUP_CONCAT(DISTINCT COALESCE(main_slug, slug)) AS slugs
FROM businesses WHERE approved = 1 AND is_test = 0
GROUP BY website HAVING COUNT(DISTINCT COALESCE(main_slug, slug)) > 1;
