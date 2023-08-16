-- CreateTable
CREATE TABLE "Url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "hashedLink" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_hashedLink_key" ON "Url"("hashedLink");
