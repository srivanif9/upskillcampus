const express = require("express");

const router = express.Router();

const search = require("../controllers/searchController");

const { isLoggedIn } = require("../middleware/authMiddleware");

router.get(

    "/search",

    isLoggedIn,

    search.searchPage

);

router.get(

    "/search/results",

    isLoggedIn,

    search.globalSearch

);

module.exports = router;