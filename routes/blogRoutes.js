const upload =
require("../middleware/blogUpload");
const express = require("express");

const router = express.Router();

const blog = require("../controllers/blogController");

const { isLoggedIn } = require("../middleware/authMiddleware");

// Create Blog Page
router.get(
    "/blogs/create",
    isLoggedIn,
    blog.createPage
);

// Save Blog
router.post(

    "/blogs/create",

    isLoggedIn,

    upload.single("featuredImage"),

    blog.createBlog

);
// View Blogs
router.get(
    "/blogs",
    isLoggedIn,
    blog.blogList
);
// Open Edit Blog Page
router.get(
    "/blogs/edit/:id",
    isLoggedIn,
    blog.editPage
);

// Update Blog
router.post(
    "/blogs/edit/:id",
    isLoggedIn,
    upload.single("featuredImage"),
    blog.updateBlog
);
// Delete Blog
router.get(
    "/blogs/delete/:id",
    isLoggedIn,
    blog.deleteBlog
);
// View Published Blog
router.get(
    "/blog/:slug",
    blog.viewBlog
);
module.exports = router;