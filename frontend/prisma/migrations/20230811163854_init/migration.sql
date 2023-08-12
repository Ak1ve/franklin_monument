-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "organization" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "faxNumber" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "address" TEXT,
    "orderId" INTEGER
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactId" INTEGER NOT NULL,
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
    "canDeleteUsers" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CatalogedItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isCommissionable" BOOLEAN NOT NULL,
    "isSizeable" BOOLEAN NOT NULL,
    "deleted" DATETIME
);

-- CreateTable
CREATE TABLE "CatalogedItemOptionValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "subtext" TEXT NOT NULL,
    "deleted" DATETIME,
    "catalogedItemOptionId" INTEGER NOT NULL,
    CONSTRAINT "CatalogedItemOptionValue_catalogedItemOptionId_fkey" FOREIGN KEY ("catalogedItemOptionId") REFERENCES "CatalogedItemOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CatalogedItemOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "allowNull" BOOLEAN NOT NULL DEFAULT true,
    "allowMulti" BOOLEAN NOT NULL DEFAULT true,
    "deleted" DATETIME,
    "catalogedItemId" INTEGER NOT NULL,
    CONSTRAINT "CatalogedItemOption_catalogedItemId_fkey" FOREIGN KEY ("catalogedItemId") REFERENCES "CatalogedItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CatalogedTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "collation" INTEGER NOT NULL,
    "catalogedItemId" INTEGER NOT NULL,
    "triggersTaskId" INTEGER,
    "triggersAtBeginning" BOOLEAN NOT NULL DEFAULT false,
    "triggersAfterAllTasks" BOOLEAN NOT NULL DEFAULT false,
    "deleted" DATETIME,
    CONSTRAINT "CatalogedTask_catalogedItemId_fkey" FOREIGN KEY ("catalogedItemId") REFERENCES "CatalogedItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CatalogedTask_triggersTaskId_fkey" FOREIGN KEY ("triggersTaskId") REFERENCES "CatalogedTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserTaskComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "userTaskId" INTEGER NOT NULL,
    "postedOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    CONSTRAINT "UserTaskComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTaskComment_userTaskId_fkey" FOREIGN KEY ("userTaskId") REFERENCES "UserTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "catalogedTaskId" INTEGER NOT NULL,
    "orderItemId" INTEGER NOT NULL,
    "startedOn" DATETIME,
    "completedOn" DATETIME,
    CONSTRAINT "UserTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTask_catalogedTaskId_fkey" FOREIGN KEY ("catalogedTaskId") REFERENCES "CatalogedTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTask_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItemSpecification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "catalogedItemOptionId" INTEGER NOT NULL,
    "orderItemId" INTEGER NOT NULL,
    CONSTRAINT "OrderItemSpecification_catalogedItemOptionId_fkey" FOREIGN KEY ("catalogedItemOptionId") REFERENCES "CatalogedItemOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItemSpecification_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "File_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "catalogedItemId" INTEGER NOT NULL,
    "length" REAL,
    "width" REAL,
    "height" REAL,
    "price" TEXT NOT NULL,
    "isTaxExempt" BOOLEAN NOT NULL DEFAULT false,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_catalogedItemId_fkey" FOREIGN KEY ("catalogedItemId") REFERENCES "CatalogedItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "deceasedName" TEXT,
    "orderType" TEXT,
    "promiseDate" DATETIME,
    "customerContactId" INTEGER,
    "isTaxExempt" BOOLEAN NOT NULL DEFAULT false,
    "deliveryMethod" TEXT,
    "cemeteryContactId" INTEGER,
    "description" TEXT,
    "placementName1" TEXT,
    "placementName2" TEXT,
    "placementName3" TEXT,
    "placementName4" TEXT,
    "placementName5" TEXT,
    "placementName6" TEXT,
    "placementName7" TEXT,
    "placementName8" TEXT,
    "memorialPlacement" INTEGER NOT NULL DEFAULT 1,
    "readTop" BOOLEAN NOT NULL DEFAULT true,
    "section" TEXT,
    "lot" TEXT,
    "grave" TEXT,
    "faceStone" TEXT,
    "foundationLength" TEXT,
    "foundationWidth" TEXT,
    "placementNotes" TEXT,
    "deleted" DATETIME,
    CONSTRAINT "Order_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_customerContactId_fkey" FOREIGN KEY ("customerContactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_cemeteryContactId_fkey" FOREIGN KEY ("cemeteryContactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CatalogedItemOptionValueToOrderItemSpecification" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CatalogedItemOptionValueToOrderItemSpecification_A_fkey" FOREIGN KEY ("A") REFERENCES "CatalogedItemOptionValue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CatalogedItemOptionValueToOrderItemSpecification_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderItemSpecification" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CatalogedTaskToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CatalogedTaskToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "CatalogedTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CatalogedTaskToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_contactId_key" ON "User"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogedTask_catalogedItemId_key" ON "CatalogedTask"("catalogedItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerContactId_key" ON "Order"("customerContactId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_cemeteryContactId_key" ON "Order"("cemeteryContactId");

-- CreateIndex
CREATE UNIQUE INDEX "_CatalogedItemOptionValueToOrderItemSpecification_AB_unique" ON "_CatalogedItemOptionValueToOrderItemSpecification"("A", "B");

-- CreateIndex
CREATE INDEX "_CatalogedItemOptionValueToOrderItemSpecification_B_index" ON "_CatalogedItemOptionValueToOrderItemSpecification"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CatalogedTaskToUser_AB_unique" ON "_CatalogedTaskToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CatalogedTaskToUser_B_index" ON "_CatalogedTaskToUser"("B");
