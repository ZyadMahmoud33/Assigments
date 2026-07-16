const mongoose = require("mongoose");
const Note = require("../models/Note");

// 1. create a note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;

    const note = new Note({ title, content, userId });
    await note.save();

    res.status(201).json({ message: "Note created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. update a single note (owner only)
const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    const { title, content } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();

    res.status(200).json({ message: "updated", note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. replace an entire note (owner only)
const replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    const { title, content } = req.body;

    note.title = title;
    note.content = content;
    note.userId = userId;

    await note.save();

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. update the title of all notes for the logged in user
const updateAllTitles = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const result = await Note.updateMany({ userId }, { $set: { title } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No note found" });
    }

    res.status(200).json({ message: "All notes updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. delete a single note (owner only)
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({ message: "deleted", note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. paginated + sorted list of notes for logged in user
const paginateSort = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. get a note by id (owner only)
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8. get a note for logged in user by its content
const getNoteByContent = async (req, res) => {
  try {
    const userId = req.userId;
    const { content } = req.query;

    const note = await Note.findOne({ userId, content });

    if (!note) {
      return res.status(404).json({ message: "No note found" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 9. get all notes for logged in user with the owner's email (populate)
const getNotesWithUser = async (req, res) => {
  try {
    const userId = req.userId;

    const notes = await Note.find({ userId })
      .select("title userId createdAt")
      .populate("userId", "email");

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 10. aggregation - notes with user info + optional search by title
const aggregateNotesWithUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.query;

    const match = { userId: new mongoose.Types.ObjectId(userId) };
    if (title) {
      match.title = title;
    }

    const notes = await Note.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          title: 1,
          userId: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 11. delete all notes for logged in user
const deleteAllNotes = async (req, res) => {
  try {
    const userId = req.userId;
    await Note.deleteMany({ userId });

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};
