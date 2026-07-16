const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("connected to mongodb ->", process.env.DB_NAME);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("db not connected yet, call connectDB first");
  }
  return db;
}

module.exports = { connectDB, getDB };
