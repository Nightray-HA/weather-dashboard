/*
  Warnings:

  - Added the required column `condition` to the `Weather` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Weather" ADD COLUMN     "condition" TEXT NOT NULL;
