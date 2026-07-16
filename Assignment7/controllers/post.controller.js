const { Post, User, Comment, sequelize } = require('../models');

// POST /posts
exports.createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const post = new Post({ title, content, userId });
    await post.save();

    return res.status(201).json({ message: 'Post created successfully.' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE /posts/:postId (only the owner can delete, userId comes from the body)
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    await post.destroy(); // soft delete, model is paranoid
    return res.status(200).json({ message: 'Post deleted.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /posts/details
exports.getPostsDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title'],
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Comment, attributes: ['id', 'content'] },
      ],
    });

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /posts/comment-count
exports.getPostsCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        'id',
        'title',
        [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount'],
      ],
      include: [{ model: Comment, attributes: [] }],
      group: ['Post.id'],
    });

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
