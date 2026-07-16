const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// 5. insert one book
const insertBook = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("books").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. insert many books (expects an array in the body)
const insertBooksBatch = async (req, res) => {
  try {
    const db = getDB();
    const books = req.body;
    if (!Array.isArray(books) || books.length < 1) {
      return res.status(400).json({ error: "body must be an array of books" });
    }
    const result = await db.collection("books").insertMany(books);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. update year for book with given title
const updateBookYear = async (req, res) => {
  try {
    const db = getDB();
    const { title } = req.params;
    const { year } = req.body;
    const result = await db
      .collection("books")
      .updateOne({ title }, { $set: { year } });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. find book by title
const getBookByTitle = async (req, res) => {
  try {
    const db = getDB();
    const { title } = req.query;
    const book = await db.collection("books").findOne({ title });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10. find books published between two years
const getBooksByYearRange = async (req, res) => {
  try {
    const db = getDB();
    const from = Number(req.query.from);
    const to = Number(req.query.to);
    const books = await db
      .collection("books")
      .find({ year: { $gte: from, $lte: to } })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 11. find books by genre
const getBooksByGenre = async (req, res) => {
  try {
    const db = getDB();
    const { genre } = req.query;
    const books = await db.collection("books").find({ genres: genre }).toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 12. skip the first two, limit to the next three, sort by year desc
const getBooksSkipLimit = async (req, res) => {
  try {
    const db = getDB();
    const skip = req.query.skip ? Number(req.query.skip) : 2;
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const books = await db
      .collection("books")
      .find()
      .sort({ year: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 13. find books where year is stored as an integer (bson type "int")
const getBooksYearInteger = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .find({ year: { $type: "int" } })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 14. find books where genres does not include Horror or Science Fiction
const getBooksExcludeGenres = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .find({ genres: { $nin: ["Horror", "Science Fiction"] } })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 15. delete all books published before a given year
const deleteBooksBeforeYear = async (req, res) => {
  try {
    const db = getDB();
    const year = Number(req.query.year);
    const result = await db
      .collection("books")
      .deleteMany({ year: { $lt: year } });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 16. aggregation - filter books after 2000, sort by year desc
const aggregate1 = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $sort: { year: -1 } },
      ])
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 17. aggregation - books after 2000, only title/author/year
const aggregate2 = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $project: { _id: 0, title: 1, author: 1, year: 1 } },
      ])
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 18. aggregation - unwind genres array
const aggregate3 = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $unwind: "$genres" },
        { $project: { _id: 0, title: 1, genres: 1 } },
      ])
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 19. aggregation - join logs with books, grouped by action
const aggregate4 = async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("logs")
      .aggregate([
        {
          $addFields: {
            book_id_obj: { $toObjectId: "$book_id" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "book_id_obj",
            foreignField: "_id",
            as: "book_info",
          },
        },
        { $unwind: "$book_info" },
        {
          $group: {
            _id: "$action",
            book_details: {
              $push: {
                title: "$book_info.title",
                author: "$book_info.author",
                year: "$book_info.year",
              },
            },
          },
        },
        { $project: { _id: 0, action: "$_id", book_details: 1 } },
      ])
      .toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  insertBook,
  insertBooksBatch,
  updateBookYear,
  getBookByTitle,
  getBooksByYearRange,
  getBooksByGenre,
  getBooksSkipLimit,
  getBooksYearInteger,
  getBooksExcludeGenres,
  deleteBooksBeforeYear,
  aggregate1,
  aggregate2,
  aggregate3,
  aggregate4,
};
