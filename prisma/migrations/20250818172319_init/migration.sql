-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('BUG', 'DARK', 'DRAGON', 'ELECTRIC', 'FAIRY', 'FIGHTING', 'FIRE', 'FLYING', 'GHOST', 'GRASS', 'GROUND', 'ICE', 'NORMAL', 'POISON', 'PSYCHIC', 'ROCK', 'STEEL', 'WATER');

-- CreateEnum
CREATE TYPE "public"."MoveCategory" AS ENUM ('PHYSICAL', 'SPECIAL', 'STATUS');

-- CreateTable
CREATE TABLE "public"."Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type1" "public"."Type" NOT NULL DEFAULT 'NORMAL',
    "type2" "public"."Type",
    "height" INTEGER NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "abilityId" INTEGER,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Move" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."Type" NOT NULL DEFAULT 'NORMAL',
    "category" "public"."MoveCategory" NOT NULL DEFAULT 'PHYSICAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ability" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MoveToPokemon" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MoveToPokemon_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "public"."Pokemon"("name");

-- CreateIndex
CREATE INDEX "Pokemon_type1_type2_idx" ON "public"."Pokemon"("type1", "type2");

-- CreateIndex
CREATE UNIQUE INDEX "Move_name_key" ON "public"."Move"("name");

-- CreateIndex
CREATE INDEX "Move_type_idx" ON "public"."Move"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Ability_name_key" ON "public"."Ability"("name");

-- CreateIndex
CREATE INDEX "_MoveToPokemon_B_index" ON "public"."_MoveToPokemon"("B");

-- AddForeignKey
ALTER TABLE "public"."Pokemon" ADD CONSTRAINT "Pokemon_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "public"."Ability"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MoveToPokemon" ADD CONSTRAINT "_MoveToPokemon_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MoveToPokemon" ADD CONSTRAINT "_MoveToPokemon_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
