/*
  Warnings:

  - You are about to drop the column `postId` on the `Category` table. All the data in the column will be lost.
  - Added the required column `item` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_postId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "postId",
ADD COLUMN     "item" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_item_fkey" FOREIGN KEY ("item") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
