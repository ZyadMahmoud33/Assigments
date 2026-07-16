const { Op } = require('sequelize');
const { Comment, User, Post } = require('../models');

// POST /comments (bulk create)
exports.bulkCreateComments = async (req, res) => {
  try {
    const { comments } = req.body;
    await Comment.bulkCreate(comments);
    return res.status(201).json({ message: 'comments created.' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// PATCH /comments/:commentId
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'comment not found.' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this comment.' });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({ message: 'Comment updated.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /comments/find-or-create
exports.findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
    });

    return res.status(200).json({ comment, created });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// GET /comments/search?word=
exports.searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    const { count, rows } = await Comment.findAndCountAll({
      where: { content: { [Op.like]: `%${word}%` } },
    });

    if (count === 0) {
      return res.status(404).json({ message: 'no comments found.' });
    }

    return res.status(200).json({ count, comments: rows });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /comments/newest/:postId
exports.getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      attributes: ['id', 'content', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 3,
    });

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /comments/details/:id
exports.getCommentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Post, attributes: ['id', 'title', 'content'] },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: 'no comment found' });
    }

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
