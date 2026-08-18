const express = require("express");

const router = express.Router();

const contact = require("../controllers/contactController");

const { isLoggedIn } = require("../middleware/authMiddleware");

// ==========================
// Public Contact Page
// ==========================

router.get(
    "/contact",
    contact.contactPage
);

// ==========================
// Save Contact Message
// ==========================

router.post(
    "/contact",
    contact.saveMessage
);

// ==========================
// Admin Contact List
// ==========================

router.get(
    "/contacts",
    isLoggedIn,
    contact.contactList
);

// ==========================
// View Contact Message
// ==========================

router.get(
    "/contacts/:id",
    isLoggedIn,
    contact.viewMessage
);

// ==========================
// Mark Message as Read
// ==========================

router.get(
    "/contacts/read/:id",
    isLoggedIn,
    contact.markRead
);

// ==========================
// Delete Contact Message
// ==========================

router.get(
    "/contacts/delete/:id",
    isLoggedIn,
    contact.deleteMessage
);

module.exports = router;