const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv");
const path = require("path");
const moment = require("moment");

const prisma = new PrismaClient();
const dataFolder = "./public/data";

const sanitizeID = (data) => {
  // Removing any non-numeric characters using a regular expression
  const numericData = data.replace(/\D/g, "");

  // Check if the numeric data is an integer
  if (/^\d+$/.test(numericData)) {
    // If it is an integer, pad it with leading zeros to match the original length
    return numericData.padStart(data.length, "0");
  } else {
    return numericData;
  }
};

const sanitizeUserMobile = (userMobile) => {
  // Removing any non-numeric characters from the userMobile and return the sanitized value
  return userMobile.replace(/\D/g, "").trim().slice(-9);
};

const sanitizeTimestamp = (timestamp) => {
  // parsing the timestamp into a consistent format
  return moment(timestamp, [
    "YYYY-MM-DDTHH:mm:ssZ",
    "DD-MM-YYYY HH:mm A",
  ]).toISOString();
};

fs.readdir(dataFolder, async (err, files) => {
  if (err) {
    console.error("Error reading data folder:", err);
    return;
  }

  for (const file of files) {
    if (file.endsWith(".csv")) {
      const status = file.replace(".csv", "").split(" ").pop();
      const filePath = path.join(dataFolder, file);
      const records = await parseCSV(filePath);

      for (const record of records) {
        // Sanitize the ID field
        const sanitizedID = sanitizeID(record.ID);
        const sanitizedCardID = sanitizeID(record["Card ID"]);
        const timestamp = sanitizeTimestamp(record.Timestamp);

        // Get the existing order status for the card ID
        const existingOrderStatus = await prisma.order_status.findFirst({
          where: { id: parseInt(sanitizedID) },
          orderBy: { timestamp: "desc" }, // Order by timestamp in descending order to get the latest
        });

        // Update only if the existing timestamp is null or the new timestamp is later
        if (
          !existingOrderStatus ||
          moment(timestamp).isAfter(existingOrderStatus.timestamp)
        ) {
          // Upsert data into order_status table
          await prisma.order_status.upsert({
            where: { id: parseInt(sanitizedID) },
            update: {
              timestamp: timestamp,
              comment: record.Comment || null,
              status: status, // Add status from filename
            },
            create: {
              id: parseInt(sanitizedID),
              status: status, // Add status from filename
              timestamp: timestamp,
              comment: record.Comment || null,
            },
          });
        }

        // Insert data into card_details table
        await prisma.card_details.upsert({
          where: { card_id: parseInt(sanitizedCardID) },
          update: {},
          create: {
            card_id: parseInt(sanitizedCardID),
            order_status: {
              connect: { id: parseInt(sanitizedID) },
            },
          },
        });

        // Insert data into user_mobile table
        const sanitizedUserMobile = sanitizeUserMobile(record["User contact"]);
        await prisma.user_mobile.upsert({
          where: { user_mobile: sanitizedUserMobile },
          update: {},
          create: {
            user_mobile: sanitizedUserMobile,
            card_details: {
              connect: { card_id: parseInt(sanitizedCardID) },
            },
          },
        });
      }
    }
  }
});

//Code for parsing CSVs
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        records.push({
          ID: row[0],
          "Card ID": row[1],
          "User contact": sanitizeUserMobile(row[2]),
          Timestamp: sanitizeTimestamp(row[3]),
          Comment: row[4],
        });
      })
      .on("end", function () {
        resolve(records);
      })
      .on("error", function (error) {
        reject(error);
      });
  });
}
