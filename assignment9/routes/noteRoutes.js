const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createNote,
  updateNote,
  replaceNote,
  updateAllTitles,
  deleteNote,
  paginateSort,
  getNoteById,
  getNoteByContent,
  getNotesWithUser,
  aggregateNotesWithUser,
  deleteAllNotes,
} = require("../controllers/noteController");

router.post("/", auth, createNote);

// static routes need to come before the /:id ones or express will treat
// "all", "replace", etc as an id param
router.patch("/all", auth, updateAllTitles);
router.put("/replace/:noteId", auth, replaceNote);
router.patch("/:noteId", auth, updateNote);

router.delete("/", auth, deleteAllNotes);
router.delete("/:noteId", auth, deleteNote);

router.get("/paginate-sort", auth, paginateSort);
router.get("/note-by-content", auth, getNoteByContent);
router.get("/note-with-user", auth, getNotesWithUser);
router.get("/aggregate", auth, aggregateNotesWithUser);
router.get("/:id", auth, getNoteById);

module.exports = router;
