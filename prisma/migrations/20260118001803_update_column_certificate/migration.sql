/*
  Warnings:

  - You are about to drop the column `ExpiryDate` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `IssuedDate` on the `Certificate` table. All the data in the column will be lost.
  - Added the required column `expiryDate` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuedDate` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "ExpiryDate",
DROP COLUMN "IssuedDate",
ADD COLUMN     "expiryDate" TEXT NOT NULL,
ADD COLUMN     "issuedDate" TEXT NOT NULL;
