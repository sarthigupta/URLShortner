-- CreateTable
CREATE TABLE "URL" (
    "id" TEXT NOT NULL,
    "longURL" TEXT NOT NULL,
    "shortURL" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "URL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "URL_shortURL_key" ON "URL"("shortURL");
