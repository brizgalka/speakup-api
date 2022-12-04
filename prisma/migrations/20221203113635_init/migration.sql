/*
  Warnings:

  - A unique constraint covering the columns `[telegram]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telegram" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_key" ON "User"("telegram");
