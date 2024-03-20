require("../insertData");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

const sanitizeID = (data) => {
  return data.replace(/\D/g, "");
};

const sanitizeUserMobile = (userMobile) => {
  return userMobile.replace(/\D/g, "").trim().slice(-9);
};

router.get("/", async (req, res) => {
  return res.send(
    "Hello to the app! You can query card status using the /get_card_status endpoint. use card_id or user_mobile for query"
  );
});

router.get("/get_card_status", async (req, res) => {
  try {
    const { card_id, user_mobile } = req.query;

    if (!card_id && !user_mobile) {
      return res
        .status(400)
        .json({ error: "Card ID or mobile number not provided" });
    }

    let status;
    let comment = null;
    let timestamp = null;

    if (card_id) {
      const cardStatus = await prisma.card_details.findUnique({
        where: { card_id: parseInt(sanitizeID(card_id)) },
        include: { order_status: true },
      });
      if (cardStatus) {
        status = cardStatus.order_status.status;
        comment = cardStatus.order_status.comment;
        timestamp = cardStatus.order_status.timestamp;
      }
    } else if (user_mobile) {
      const userCard = await prisma.user_mobile.findUnique({
        where: { user_mobile: sanitizeUserMobile(user_mobile) },
        include: {
          card_details: {
            include: { order_status: true },
          },
        },
      });
      if (userCard && userCard.card_details) {
        status = userCard.card_details.order_status.status;
        comment = userCard.card_details.order_status.comment;
        timestamp = userCard.card_details.order_status.timestamp;
      }
    }

    const response = { status };
    if (comment !== null) {
      response.comment = comment;
    }
    if (timestamp !== null) {
      response.timestamp = new Date(timestamp).toISOString().slice(0, -5);
    }

    res.json(response);
  } catch (error) {
    console.error("Error querying card status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
