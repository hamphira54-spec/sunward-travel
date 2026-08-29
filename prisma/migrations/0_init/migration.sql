-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "heroImage" JSONB NOT NULL,
    "cardImage" JSONB NOT NULL,
    "airportCodes" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "heroImage" JSONB NOT NULL,
    "cardImage" JSONB NOT NULL,
    "badge" TEXT NOT NULL,
    "facts" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "affiliate" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countrySlug" TEXT NOT NULL,
    "relatedDestinations" JSONB NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "heroImage" JSONB NOT NULL,
    "cardImage" JSONB NOT NULL,
    "author" TEXT,
    "publishedAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    "readingTimeMinutes" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "body" JSONB,
    "status" TEXT,
    "seo" JSONB NOT NULL,
    "affiliateCTAs" JSONB NOT NULL,
    "tocSections" JSONB NOT NULL,
    "countrySlug" TEXT,
    "destinationSlug" TEXT,
    "destinationLabel" TEXT NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "heroImage" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "author" JSONB NOT NULL,
    "publication" JSONB NOT NULL,
    "sourceReferences" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "readingTimeMinutes" INTEGER,
    "seo" JSONB NOT NULL,
    "countrySlug" TEXT,
    "destinationSlug" TEXT,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "heroImage" JSONB NOT NULL,
    "venue" JSONB,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "timezone" TEXT,
    "allDay" BOOLEAN,
    "category" TEXT NOT NULL,
    "officialUrl" TEXT,
    "ticketUrl" TEXT,
    "sourceReferences" JSONB,
    "organizer" TEXT,
    "lifecycleStatus" TEXT NOT NULL,
    "publication" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "seo" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "countrySlug" TEXT,
    "destinationSlug" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE INDEX "Destination_countrySlug_idx" ON "Destination"("countrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "Guide_status_idx" ON "Guide"("status");

-- CreateIndex
CREATE INDEX "Guide_category_idx" ON "Guide"("category");

-- CreateIndex
CREATE INDEX "Guide_countrySlug_idx" ON "Guide"("countrySlug");

-- CreateIndex
CREATE INDEX "Guide_destinationSlug_idx" ON "Guide"("destinationSlug");

-- CreateIndex
CREATE INDEX "Guide_featured_idx" ON "Guide"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_category_idx" ON "News"("category");

-- CreateIndex
CREATE INDEX "News_countrySlug_idx" ON "News"("countrySlug");

-- CreateIndex
CREATE INDEX "News_destinationSlug_idx" ON "News"("destinationSlug");

-- CreateIndex
CREATE INDEX "News_featured_idx" ON "News"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_lifecycleStatus_idx" ON "Event"("lifecycleStatus");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Event_countrySlug_idx" ON "Event"("countrySlug");

-- CreateIndex
CREATE INDEX "Event_destinationSlug_idx" ON "Event"("destinationSlug");

-- CreateIndex
CREATE INDEX "Event_featured_idx" ON "Event"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_countrySlug_fkey" FOREIGN KEY ("countrySlug") REFERENCES "Country"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_countrySlug_fkey" FOREIGN KEY ("countrySlug") REFERENCES "Country"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_destinationSlug_fkey" FOREIGN KEY ("destinationSlug") REFERENCES "Destination"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_countrySlug_fkey" FOREIGN KEY ("countrySlug") REFERENCES "Country"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_destinationSlug_fkey" FOREIGN KEY ("destinationSlug") REFERENCES "Destination"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_countrySlug_fkey" FOREIGN KEY ("countrySlug") REFERENCES "Country"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_destinationSlug_fkey" FOREIGN KEY ("destinationSlug") REFERENCES "Destination"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

