const express = require("express");

const router = express.Router();

const profile = require("../controllers/profileController");

const upload = require("../middleware/profileUpload");

const { isLoggedIn } = require("../middleware/authMiddleware");

router.get(
    "/profile",
    isLoggedIn,
    profile.profilePage
);

router.get(
    "/profile/edit",
    isLoggedIn,
    profile.editProfilePage
);

router.post(
    "/profile/edit",
    isLoggedIn,
    upload.single("image"),
    profile.updateProfile
);
router.get(
    "/profile/password",
    isLoggedIn,
    profile.changePasswordPage
);

router.post(
    "/profile/password",
    isLoggedIn,
    profile.changePassword
);

// ==========================
// Delete Account
// ==========================

router.get(
    "/profile/delete",
    isLoggedIn,
    profile.deleteAccountPage
);

router.post(
    "/profile/delete",
    isLoggedIn,
    profile.deleteAccount
);
module.exports = router;