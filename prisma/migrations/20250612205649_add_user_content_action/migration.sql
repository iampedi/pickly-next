-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('BOOKMARK', 'INSPIRED', 'THANKS');

-- CreateTable
CREATE TABLE "UserContentAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "type" "ActionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserContentAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserContentAction_userId_contentId_type_key" ON "UserContentAction"("userId", "contentId", "type");

-- AddForeignKey
ALTER TABLE "UserContentAction" ADD CONSTRAINT "UserContentAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContentAction" ADD CONSTRAINT "UserContentAction_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
