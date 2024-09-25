-- CreateTable
CREATE TABLE "baths" (
    "id"     SERIAL       NOT NULL,
    "pet_id" INTEGER      NOT NULL,
    "time"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "baths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breeds" (
    "id"   SERIAL NOT NULL,
    "name" TEXT   NOT NULL,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id"         SERIAL  NOT NULL,
    "name"       TEXT    NOT NULL,
    "breed_id"   INTEGER NOT NULL,
    "birth_date" DATE    NOT NULL,
    "adopt_date" DATE    NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weights" (
    "id"     SERIAL           NOT NULL,
    "pet_id" INTEGER          NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "time"   TIMESTAMP(3)     NOT NULL,

    CONSTRAINT "weights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "baths"
    ADD CONSTRAINT "baths_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets"
    ADD CONSTRAINT "pets_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "breeds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weights"
    ADD CONSTRAINT "weights_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
