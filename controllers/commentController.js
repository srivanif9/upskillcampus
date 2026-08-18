const db = require("../config/db");

// ==========================
// Save Comment
// ==========================

exports.saveComment = (req, res) => {

    const blogId = req.params.id;

    const {
        name,
        email,
        comment
    } = req.body;

    if (!name || !comment) {

        return res.send("Please fill all required fields.");

    }

    const sql = `
        INSERT INTO comments
        (
            blog_id,
            name,
            email,
            comment
        )
        VALUES(?,?,?,?)
    `;
db.query(

    sql,

    [

        blogId,
        name,
        email,
        comment

    ],

    (err) => {

        if (err) {

            console.log(err);

            return res.send("Database Error");

        }

        res.redirect(req.get("Referer") || "/blogs");

    }

);
};
// ==========================
// Admin Comment List
// ==========================

exports.commentList = (req, res) => {

    const sql = `
        SELECT
            comments.*,
            blogs.title
        FROM comments
        INNER JOIN blogs
        ON comments.blog_id = blogs.id
        ORDER BY comments.created_at DESC
    `;

    db.query(sql, (err, rows) => {

        if (err) {

            console.log(err);

            return res.send("Database Error");

        }

        res.render("comments", {

            comments: rows

        });

    });

};

// ==========================
// Approve Comment
// ==========================

exports.approveComment = (req, res) => {

    db.query(

        `
        UPDATE comments
        SET status='Approved'
        WHERE id=?
        `,

        [req.params.id],

        err => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.redirect("/comments");

        }

    );

};

// ==========================
// Delete Comment
// ==========================

exports.deleteComment = (req, res) => {

    db.query(

        `
        DELETE FROM comments
        WHERE id=?
        `,

        [req.params.id],

        err => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.redirect("/comments");

        }

    );

};