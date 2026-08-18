const express = require("express");

const router = express.Router();

const page = require("../controllers/pageController");

const upload = require("../middleware/upload");

const { isLoggedIn } = require("../middleware/authMiddleware");

// ==========================
// Builder
// ==========================

router.get(
    "/builder",
    isLoggedIn,
    page.builder
);

// ==========================
// Upload Image
// ==========================

router.post(
    "/upload-image",
    isLoggedIn,
    upload.single("image"),
    page.uploadImage
);

// ==========================
// Save Page
// ==========================

router.post(
    "/save-page",
    isLoggedIn,
    page.savePage
);

// ==========================
// Pages Management Screen
// ==========================

router.get(
    "/pages",
    isLoggedIn,
    page.pagesPage
);

// ==========================
// JSON List (Used by Builder)
// ==========================

router.get(
    "/pages/list",
    isLoggedIn,
    page.getPages
);

// ==========================
// Load Page
// ==========================

router.get(
    "/page/:id",
    isLoggedIn,
    page.loadPage
);
router.get(
    "/preview/:id",
    isLoggedIn,
    page.previewPage
);
router.get(
    "/publish/:id",
    isLoggedIn,
    page.publishPage
);
// Public Website Page
router.get(
    "/:pageName",
    page.publicPage
);
router.get("/builder", (req, res) => {
    res.send("BUILDER ROUTE WORKING");
});
module.exports = router;