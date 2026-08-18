const express = require("express");

const router = express.Router();

const dashboard = require("../controllers/dashboardController");

const { isLoggedIn } = require("../middleware/authMiddleware");

router.get(
    "/dashboard",
    isLoggedIn,
    dashboard.dashboard
);

module.exports = router;