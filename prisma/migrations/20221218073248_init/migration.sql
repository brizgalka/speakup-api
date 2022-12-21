/*
  Warnings:

  - Added the required column `secret` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "secret" TEXT NOT NULL;
