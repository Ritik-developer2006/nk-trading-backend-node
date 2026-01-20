require("dotenv").config();
const app = require("./src/app");
const connectMongo = require("./src/config/mongodb");

connectMongo();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
