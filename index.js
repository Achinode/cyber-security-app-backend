require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./src/db/connect");
const { router } = require("./src/routes/_index.routes");

const PORT = process.env.PORT || 5500;
const ENVTYPE = process.env.ENVTYPE || "DEV";

let ORIGINS = process.env.ORIGINS;

if (ENVTYPE === "DEV") {
    ORIGINS = "*";
}

const app = express();

app.use(cors({ origin: ORIGINS }));
app.use(express.json());

app.use("/api/v1", router);

app.listen(PORT, () => console.log("Server is running at " + PORT));
