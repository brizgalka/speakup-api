/*
  Warnings:

  - Added the required column `user1Name` to the `Dialog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Name` to the `Dialog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dialog" ADD COLUMN     "user1Name" TEXT NOT NULL,
ADD COLUMN     "user2Name" TEXT NOT NULL;
