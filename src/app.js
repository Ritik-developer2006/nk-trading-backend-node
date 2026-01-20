const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", require("./routes/test.routes"));

module.exports = app;
