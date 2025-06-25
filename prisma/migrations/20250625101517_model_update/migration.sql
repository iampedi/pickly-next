/*
  Warnings:

  - You are about to drop the `CategoryTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagTranslation` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Content` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `Content` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Content` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TagTranslation" DROP CONSTRAINT "TagTranslation_tagId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- DropTable
DROP TABLE "CategoryTranslation";

-- DropTable
DROP TABLE "TagTranslation";

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
