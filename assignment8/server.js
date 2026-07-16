const express = require("express");
const { connectDB } = require("./config/db");

const collectionRoutes = require("./routes/collectionRoutes");
const bookRoutes = require("./routes/bookRoutes");
const logRoutes = require("./routes/logRoutes");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/collection", collectionRoutes);
app.use("/books", bookRoutes);
app.use("/logs", logRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("failed to connect to db", err);
    process.exit(1);
  });
