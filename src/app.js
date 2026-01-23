const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
    // origin: "http://localhost:8000", // Laravel URL
    // methods: ["GET", "POST"],
    // credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;
