const express = require("express");

const router = express.Router();

const comment = require("../controllers/commentController");

const { isLoggedIn } = require("../middleware/authMiddleware");

// ==========================
// Save Comment
// ==========================

router.post(
    "/blog/:id/comment",
    comment.saveComment
);

// ==========================
// Admin Comment List
// ==========================
router.get(
    "/comments",
    isLoggedIn,
    comment.commentList
);
// ==========================
// Approve Comment
// ==========================

router.get(
    "/comments/approve/:id",
    isLoggedIn,
    comment.approveComment
);

// ==========================
// Delete Comment
// ==========================

router.get(
    "/comments/delete/:id",
    isLoggedIn,
    comment.deleteComment
);

module.exports = router;