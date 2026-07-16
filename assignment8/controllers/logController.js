const { getDB } = require("../config/db");

// 7. insert one log
const insertLog = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("logs").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { insertLog };
