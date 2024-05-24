-- CreateEnum
CREATE TYPE "Status" AS ENUM ('online', 'offline', 'operating', 'analyzing', 'limit');

-- CreateEnum
CREATE TYPE "License" AS ENUM ('trial', 'vip', 'premium');

-- CreateEnum
CREATE TYPE "Recurrency" AS ENUM ('monthly', 'quarterly', 'annually');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('red', 'black', 'green');

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_reset_token" TEXT,
    "betsMade" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "balance" INTEGER,
    "status" "Status",
    "license" "License",
    "recurrency" "Recurrency",
    "licensedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "credentials" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "configs" (
    "userId" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "entry" INTEGER NOT NULL,
    "gales" INTEGER NOT NULL,
    "stopWin" INTEGER NOT NULL,
    "stopLoss" INTEGER NOT NULL,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "bets" (
    "betId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "color" "Color" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entry" INTEGER NOT NULL,
    "gains" INTEGER NOT NULL,
    "result" BOOLEAN NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("betId")
);

-- CreateTable
CREATE TABLE "BalanceTracks" (
    "balanceTrackId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BalanceTracks_pkey" PRIMARY KEY ("balanceTrackId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_reset_token_key" ON "users"("password_reset_token");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_key" ON "credentials"("email");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configs" ADD CONSTRAINT "configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceTracks" ADD CONSTRAINT "BalanceTracks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
