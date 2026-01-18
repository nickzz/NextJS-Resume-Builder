/*
  Warnings:

  - You are about to drop the column `year` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Reference` table. All the data in the column will be lost.
  - Added the required column `ExpiryDate` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IssueDate` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Reference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `Reference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Reference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skillType` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "year",
ADD COLUMN     "ExpiryDate" TEXT NOT NULL,
ADD COLUMN     "IssueDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "contact",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT NOT NULL,
ADD COLUMN     "position" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "skillType" TEXT NOT NULL;
