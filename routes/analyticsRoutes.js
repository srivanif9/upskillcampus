const express = require("express");

const router = express.Router();

const analytics = require("../controllers/analyticsController");

const { isLoggedIn } = require("../middleware/authMiddleware");

router.get(

    "/analytics",

    isLoggedIn,

    analytics.analyticsPage

);

module.exports = router;