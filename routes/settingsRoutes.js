const express = require("express");

const router = express.Router();

const settings = require("../controllers/settingsController");

const { isLoggedIn } = require("../middleware/authMiddleware");

router.get(

    "/settings",

    isLoggedIn,

    settings.settingsPage

);
router.post(
    "/settings",
    isLoggedIn,
    settings.saveSettings
);
module.exports = router;