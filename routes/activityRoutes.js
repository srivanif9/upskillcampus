const express = require("express");

const router = express.Router();

const activity = require("../controllers/activityController");

const { isLoggedIn } = require("../middleware/authMiddleware");

router.get(

    "/activity",

    isLoggedIn,

    activity.activityPage

);

module.exports = router;