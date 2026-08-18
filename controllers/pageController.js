const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

// Open Builder
exports.builder = (req, res) => {

    res.render("builder", {
        user: req.session.user
    });

};

// Upload Image
exports.uploadImage = (req, res) => {

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "No image uploaded"
        });

    }

    res.json({
        success: true,
        imageUrl: "/uploads/images/" + req.file.filename
    });

};

// Save Page
exports.savePage = (req, res) => {

    const userId = req.session.user.id;

    const {

        pageId,

        pageName,

        layout

    } = req.body;

    if (!pageName || !layout) {

        return res.json({

            success: false,

            message: "Missing data"

        });

    }

    // -------------------------
    // UPDATE EXISTING PAGE
    // -------------------------

    if (pageId) {

        const sql = `

        UPDATE pages

        SET

        page_name=?,

        layout_json=?

        WHERE

        id=?

        AND user_id=?

        `;

        db.query(

            sql,

            [

                pageName,

                JSON.stringify(layout),

                pageId,

                userId

            ],

            err => {

                if (err) {

                    console.log(err);

                    return res.json({

                        success: false,

                        message: "Database Error"

                    });

                }
                logActivity(
    userId,
    `Updated page: ${pageName}`
);

res.json({

    success: true,

    message: "Page Updated Successfully"

});
            }

        );

        return;

    }

    // -------------------------
    // CHECK DUPLICATE NAME
    // -------------------------

    db.query(

        "SELECT id FROM pages WHERE user_id=? AND page_name=?",

        [

            userId,

            pageName

        ],

        (err, rows) => {

            if (err) {

                return res.json({

                    success: false,

                    message: "Database Error"

                });

            }

            if (rows.length > 0) {

                return res.json({

                    success: false,

                    message: "Page name already exists."

                });

            }

          db.query(

    `

    INSERT INTO pages

    (user_id,page_name,layout_json)

    VALUES(?,?,?)

    `,

    [

        userId,

        pageName,

        JSON.stringify(layout)

    ],

    (err, result) => {

        if (err) {

            console.log(err);

            return res.json({

                success: false,

                message: "Database Error"

            });

        }

        logActivity(
            userId,
            `Created page: ${pageName}`
        );

        res.json({

            success: true,

            message: "Page Created Successfully",

            pageId: result.insertId

        });

    }

);
        }

    );

};
// ==========================
// Pages Management Screen
// ==========================

exports.pagesPage = (req, res) => {

    const userId = req.session.user.id;

    db.query(

        `
        SELECT *
        FROM pages
        WHERE user_id=?
        ORDER BY created_at DESC
        `,

        [userId],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.render("pages", {

                pages: rows

            });

        }

    );

};
// Get all pages for logged-in user
exports.getPages = (req, res) => {

    const userId = req.session.user.id;

    db.query(
        "SELECT id,page_name FROM pages WHERE user_id=? ORDER BY id DESC",
        [userId],
        (err, result) => {

            if (err) {

                return res.json([]);

            }

            res.json(result);

        }
    );

};

// Load a page
exports.loadPage = (req, res) => {

    const pageId = req.params.id;

    const userId = req.session.user.id;

    db.query(

        "SELECT * FROM pages WHERE id=? AND user_id=?",

        [pageId, userId],

        (err, result) => {

            if (err || result.length === 0) {

                return res.json({

                    success: false

                });

            }

            res.json({

                success: true,

                page: result[0]

            });

        }

    );

};
// ==========================
// Public Website
// ==========================
exports.publicPage = (req, res, next) => {
const reservedRoutes = [
    "blogs",
    "blog",
    "builder",
    "pages",
    "page",
    "media",
    "profile",
    "settings",
    "login",
    "register",
    "logout",
    "dashboard",
    "comments",
    "contact",
    "contacts",
    "save-page",
    "upload-image",
    "search",
"search/results",
"activity",
    "test"
];
    if (reservedRoutes.includes(req.params.pageName)) {
        return next();
    }

    const sql = `
        SELECT *
        FROM pages
        WHERE page_name=?
    `;

    db.query(sql, [req.params.pageName], (err, rows) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (rows.length === 0) {
            return res.send("Page Not Found");
        }

        const page = rows[0];

        const layout = JSON.parse(page.layout_json || "[]");

        res.render("publicPage", {
            page,
            layout
        });

    });

};
exports.previewPage = (req, res) => {

    db.query(

        "SELECT * FROM pages WHERE id=? AND user_id=?",

        [

            req.params.id,

            req.session.user.id

        ],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            if (rows.length === 0) {

                return res.send("Page Not Found");

            }

            res.render("publicPage", {

                page: rows[0],

                layout: JSON.parse(rows[0].layout_json || "[]")

            });

        }

    );

};
exports.publishPage = (req, res) => {

    db.query(

        "SELECT page_name FROM pages WHERE id=? AND user_id=?",

        [

            req.params.id,

            req.session.user.id

        ],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            if (rows.length === 0) {

                return res.send("Page Not Found");

            }

            res.send(

                "<h2>Page Published Successfully</h2>" +

                "<p>Your page is now available at:</p>" +

                "<a href='/" +

                rows[0].page_name +

                "' target='_blank'>http://localhost:3000/" +

                rows[0].page_name +

                "</a>"

            );

        }

    );

};