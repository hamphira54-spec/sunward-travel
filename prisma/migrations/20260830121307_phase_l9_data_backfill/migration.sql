-- Backfill Guide status
UPDATE "Guide"
SET "publishStatus" = 'published', "publishDate" = NOW()
WHERE "status" = 'published' AND "publishStatus" != 'published';

-- Backfill News status from publication JSON
UPDATE "News"
SET "publishStatus" = 'published', "publishDate" = NOW()
WHERE "publication"->>'status' = 'published' AND "publishStatus" != 'published';

-- Backfill Event status from publication JSON
UPDATE "Event"
SET "publishStatus" = 'published', "publishDate" = NOW()
WHERE "publication"->>'status' = 'published' AND "publishStatus" != 'published';
