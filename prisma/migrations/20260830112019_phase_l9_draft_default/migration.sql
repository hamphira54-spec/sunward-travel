-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "publishStatus" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Guide" ALTER COLUMN "publishStatus" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "News" ALTER COLUMN "publishStatus" SET DEFAULT 'draft';
