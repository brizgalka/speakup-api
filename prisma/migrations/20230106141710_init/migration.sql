/*
  Warnings:

  - You are about to drop the column `awards` on the `User` table. All the data in the column will be lost.
  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "awards",
ADD COLUMN     "bio" TEXT NOT NULL;
