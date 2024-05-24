-- AlterTable
ALTER TABLE "users" ADD COLUMN     "affiliateId" TEXT;

-- CreateTable
CREATE TABLE "affiliates" (
    "affiliateId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "affiliates_pkey" PRIMARY KEY ("affiliateId")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "affiliates"("affiliateId") ON DELETE SET NULL ON UPDATE CASCADE;
