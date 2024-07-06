/*
  Warnings:

  - The primary key for the `Referree` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Referrer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[referralCode]` on the table `Referrer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referredBy` to the `Referree` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralCode` to the `Referrer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Referree` DROP PRIMARY KEY,
    ADD COLUMN `referredBy` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Referrer` DROP PRIMARY KEY,
    ADD COLUMN `referralCode` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Referrer_referralCode_key` ON `Referrer`(`referralCode`);

-- AddForeignKey
ALTER TABLE `Referree` ADD CONSTRAINT `Referree_referredBy_fkey` FOREIGN KEY (`referredBy`) REFERENCES `Referrer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
