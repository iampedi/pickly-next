/*
  Warnings:

  - A unique constraint covering the columns `[userId,contentId]` on the table `Curation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Curation_userId_contentId_key" ON "Curation"("userId", "contentId");
