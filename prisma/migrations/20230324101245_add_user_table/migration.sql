/*
  Warnings:

  - Added the required column `jokesterId` to the `Joke` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Joke" ADD COLUMN     "jokesterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Joke" ADD CONSTRAINT "Joke_jokesterId_fkey" FOREIGN KEY ("jokesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
