-- CreateTable
CREATE TABLE "order_status" (
    "id" INTEGER NOT NULL,
    "status" VARCHAR(10),
    "timestamp" TIMESTAMP(6),
    "comment" VARCHAR(50),

    CONSTRAINT "order_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_details" (
    "card_id" INTEGER NOT NULL,
    "order_id" INTEGER,

    CONSTRAINT "card_details_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "user_mobile" (
    "user_mobile" VARCHAR(50) NOT NULL,
    "card_id" INTEGER,

    CONSTRAINT "user_mobile_pkey" PRIMARY KEY ("user_mobile")
);

-- AddForeignKey
ALTER TABLE "card_details" ADD CONSTRAINT "card_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_mobile" ADD CONSTRAINT "user_mobile_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "card_details"("card_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
