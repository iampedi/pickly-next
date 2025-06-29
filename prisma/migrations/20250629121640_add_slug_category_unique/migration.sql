/*
  Warnings:

  - A unique constraint covering the columns `[slug,categoryId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "slug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_categoryId_key" ON "Content"("slug", "categoryId");
