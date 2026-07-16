const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.post('/comments', commentController.bulkCreateComments);
router.post('/comments/find-or-create', commentController.findOrCreateComment);
router.get('/comments/search', commentController.searchComments);
router.get('/comments/newest/:postId', commentController.getNewestComments);
router.get('/comments/details/:id', commentController.getCommentDetails);
router.patch('/comments/:commentId', commentController.updateComment);

module.exports = router;
