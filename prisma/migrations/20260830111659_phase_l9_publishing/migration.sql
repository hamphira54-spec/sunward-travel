-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "publishDate" TIMESTAMP(3),
ADD COLUMN     "publishStatus" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "scheduleDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "publishDate" TIMESTAMP(3),
ADD COLUMN     "publishStatus" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "scheduleDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "publishDate" TIMESTAMP(3),
ADD COLUMN     "publishStatus" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "scheduleDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PublishingAudit" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "actorAdminUserId" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishingAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublishingAudit_contentType_contentId_idx" ON "PublishingAudit"("contentType", "contentId");
