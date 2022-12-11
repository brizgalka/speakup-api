/*
  Warnings:

  - Added the required column `salt` to the `VerifyToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerifyToken" ADD COLUMN     "salt" TEXT NOT NULL;
