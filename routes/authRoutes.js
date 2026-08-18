const express = require("express");
const router = express.Router();

const auth = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const { isLoggedIn } = require("../middleware/authMiddleware");


// ==========================
// Home
// ==========================

router.get("/", (req, res) => {
    res.redirect("/login");
});


// ==========================
// Register
// ==========================

router.get("/register", auth.registerPage);
router.post("/register", auth.register);


// ==========================
// Login
// ==========================

router.get("/login", auth.loginPage);
router.post("/login", auth.login);

// ==========================
// Forgot Password
// ==========================

router.get(
    "/forgot-password",
    auth.forgotPasswordPage
);

router.post(
    "/forgot-password",
    auth.forgotPassword
);


// ==========================
// Reset Password
// ==========================

router.get(
    "/reset-password/:token",
    auth.resetPasswordPage
);

router.post(
    "/reset-password",
    auth.resetPassword
);
// ==========================
// Logout
// ==========================

router.get("/logout", auth.logout);


// ==========================
// Dashboard
// ==========================

router.get(
    "/dashboard",
    isLoggedIn,
    dashboardController.dashboard
);


// Placeholder Routes (EXCEPT /builder)


module.exports = router;