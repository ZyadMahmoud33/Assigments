const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post('/posts', postController.createPost);
router.get('/posts/details', postController.getPostsDetails);
router.get('/posts/comment-count', postController.getPostsCommentCount);
router.delete('/posts/:postId', postController.deletePost);

module.exports = router;
