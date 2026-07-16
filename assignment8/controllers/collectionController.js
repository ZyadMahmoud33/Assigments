const { getDB } = require("../config/db");

// 1. explicit collection with validation rule (title required + non-empty)
const createBooksCollection = async (req, res) => {
  try {
    const db = getDB();
    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              description: "title is required and must not be empty",
            },
          },
        },
      },
    });
    res.status(201).json({ ok: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. implicit collection - just insert, mongo creates the collection for us
const createAuthorsCollection = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("authors").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. capped collection, 1MB limit
const createCappedLogsCollection = async (req, res) => {
  try {
    const db = getDB();
    await db.createCollection("logs", {
      capped: true,
      size: 1048576, // 1MB
    });
    res.status(201).json({ ok: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. index on title field
const createBooksTitleIndex = async (req, res) => {
  try {
    const db = getDB();
    const indexName = await db.collection("books").createIndex({ title: 1 });
    res.status(201).json(indexName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooksCollection,
  createAuthorsCollection,
  createCappedLogsCollection,
  createBooksTitleIndex,
};
