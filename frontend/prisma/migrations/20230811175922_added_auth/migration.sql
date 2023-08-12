/*
  Warnings:

  - You are about to drop the column `contactId` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "File_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("createdAt", "filePath", "fileType", "hash", "id", "orderId") SELECT "createdAt", "filePath", "fileType", "hash", "id", "orderId" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "canCreateCatalogedItems" BOOLEAN NOT NULL DEFAULT false,
    "canEditCatalogedItems" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteCatalogedItems" BOOLEAN NOT NULL DEFAULT false,
    "canViewCatalogedItems" BOOLEAN NOT NULL DEFAULT true,
    "canCreateCatalogedTasks" BOOLEAN NOT NULL DEFAULT false,
    "canEditCatalogedTasks" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteCatalogedTasks" BOOLEAN NOT NULL DEFAULT false,
    "canViewCatalogedTasks" BOOLEAN NOT NULL DEFAULT true,
    "canCreateAddresses" BOOLEAN NOT NULL DEFAULT false,
    "canEditAddresses" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteAddresses" BOOLEAN NOT NULL DEFAULT false,
    "canViewAddresses" BOOLEAN NOT NULL DEFAULT true,
    "canCreateOrders" BOOLEAN NOT NULL DEFAULT false,
    "canEditOrders" BOOLEAN NOT NULL DEFAULT false,
    "canViewOrders" BOOLEAN NOT NULL DEFAULT false,
    "canForceStartTasks" BOOLEAN NOT NULL DEFAULT false,
    "canUploadDocuments" BOOLEAN NOT NULL DEFAULT false,
    "canMakeTaskComments" BOOLEAN NOT NULL DEFAULT false,
    "canMarkForeignTasksComplete" BOOLEAN NOT NULL DEFAULT false,
    "canCreateOrderItems" BOOLEAN NOT NULL DEFAULT false,
    "canEditOrderItems" BOOLEAN NOT NULL DEFAULT false,
    "canViewOrderFinancials" BOOLEAN NOT NULL DEFAULT false,
    "canViewReports" BOOLEAN NOT NULL DEFAULT false,
    "canCreateUsers" BOOLEAN NOT NULL DEFAULT false,
    "canEditUsers" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteUsers" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("canCreateAddresses", "canCreateCatalogedItems", "canCreateCatalogedTasks", "canCreateOrderItems", "canCreateOrders", "canCreateUsers", "canDeleteAddresses", "canDeleteCatalogedItems", "canDeleteCatalogedTasks", "canDeleteUsers", "canEditAddresses", "canEditCatalogedItems", "canEditCatalogedTasks", "canEditOrderItems", "canEditOrders", "canEditUsers", "canForceStartTasks", "canMakeTaskComments", "canMarkForeignTasksComplete", "canUploadDocuments", "canViewAddresses", "canViewCatalogedItems", "canViewCatalogedTasks", "canViewOrderFinancials", "canViewOrders", "canViewReports", "id") SELECT "canCreateAddresses", "canCreateCatalogedItems", "canCreateCatalogedTasks", "canCreateOrderItems", "canCreateOrders", "canCreateUsers", "canDeleteAddresses", "canDeleteCatalogedItems", "canDeleteCatalogedTasks", "canDeleteUsers", "canEditAddresses", "canEditCatalogedItems", "canEditCatalogedTasks", "canEditOrderItems", "canEditOrders", "canEditUsers", "canForceStartTasks", "canMakeTaskComments", "canMarkForeignTasksComplete", "canUploadDocuments", "canViewAddresses", "canViewCatalogedItems", "canViewCatalogedTasks", "canViewOrderFinancials", "canViewOrders", "canViewReports", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
