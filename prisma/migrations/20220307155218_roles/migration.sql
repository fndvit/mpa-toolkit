-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CONTENT_MANAGER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';
