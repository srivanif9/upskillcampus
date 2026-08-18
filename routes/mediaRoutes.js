const express = require("express");

const router = express.Router();

const media = require("../controllers/mediaController");

const upload = require("../middleware/mediaUpload");
const { isLoggedIn } = require("../middleware/authMiddleware");

// Media Library

router.get(

    "/media",

    isLoggedIn,

    media.mediaPage

);

// Upload Media

router.post(

    "/media/upload",

    isLoggedIn,

    upload.single("media"),

    media.uploadMedia

);
router.get(

    "/media/delete/:id",

    isLoggedIn,

    media.deleteMedia

);
router.get(

    "/media/list",

    isLoggedIn,

    media.mediaList

);
router.get(
    "/media/view/:id",
    isLoggedIn,
    media.viewMedia
);
router.post(

    "/media/delete-selected",

    isLoggedIn,

    media.deleteSelected

);
module.exports = router;