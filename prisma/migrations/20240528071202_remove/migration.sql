/*
  Warnings:

  - You are about to drop the column `mobile` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_mobile_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `mobile`;
