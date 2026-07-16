const express = require("express");
const router = express.Router();
const {
  createBooksCollection,
  createAuthorsCollection,
  createCappedLogsCollection,
  createBooksTitleIndex,
} = require("../controllers/collectionController");

router.post("/books", createBooksCollection);
router.post("/authors", createAuthorsCollection);
router.post("/logs/capped", createCappedLogsCollection);
router.post("/books/index", createBooksTitleIndex);

module.exports = router;
