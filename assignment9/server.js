const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("failed to connect to db", err);
    process.exit(1);
  });
