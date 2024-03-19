const express = require("express");
const route = require("./routes/route.js");
const db = require("./db/db.js");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());
app.use("/", route);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
