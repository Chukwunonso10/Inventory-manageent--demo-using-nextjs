/*
  Warnings:

  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
