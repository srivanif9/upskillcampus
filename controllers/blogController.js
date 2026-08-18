const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

// ==========================
// Open Create Blog Page
// ==========================

exports.createPage = (req, res) => {

    res.render("createBlog", {

        user: req.session.user

    });

};
// ==========================
// Save Blog
// ==========================

exports.createBlog = (req, res) => {

    const {
        title,
        slug,
        category,
        tags,
        content,
        status
    } = req.body;
    let featuredImage = req.body.selectedImage || "";

if(req.file){

    featuredImage = "/uploads/blogs/" + req.file.filename;

}
    const checkSql = `
        SELECT id
        FROM blogs
        WHERE slug=?
    `;

    db.query(checkSql, [slug], (err, rows) => {

        if (err) {

            console.log(err);

            return res.send("Database Error");

        }

        if (rows.length > 0) {

            return res.send("Slug already exists. Please choose another.");

        }

        const sql = `
            INSERT INTO blogs
            (
                user_id,
                title,
                slug,
                category,
                tags,
                featured_image,
                content,
                status
            )
            VALUES(?,?,?,?,?,?,?,?)
        `;

        db.query(

            sql,

            [

                req.session.user.id,
                title,
                slug,
                category,
                tags,
                featuredImage,
                content,
                status

            ],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.send("Database Error");

                }

               logActivity(
    req.session.user.id,
    `Created blog: ${title}`
);

res.send("Blog Saved Successfully");

            }

        );

    });

};
// ==========================
// Blog List
// ==========================

exports.blogList = (req, res) => {

    const search = req.query.search || "";
    const category = req.query.category || "";

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    // Count total blogs (with filters)
    let countSql = `
        SELECT COUNT(*) AS total
        FROM blogs
        WHERE user_id=?
        AND title LIKE ?
    `;

    const countValues = [

        req.session.user.id,

        "%" + search + "%"

    ];

    if(category !== ""){

        countSql += " AND category=?";

        countValues.push(category);

    }

    db.query(countSql, countValues, (err, countResult)=>{

        if(err){

            console.log(err);

            return res.send("Database Error");

        }

        const totalBlogs = countResult[0].total;

        const totalPages = Math.ceil(totalBlogs / limit);

        // Main query
        let sql = `
            SELECT
                id,
                title,
                slug,
                category,
                status,
                featured_image,
                created_at
            FROM blogs
            WHERE user_id=?
            AND title LIKE ?
        `;

        const values = [

            req.session.user.id,

            "%" + search + "%"

        ];

        if(category !== ""){

            sql += " AND category=?";

            values.push(category);

        }

        sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";

        values.push(limit);

        values.push(offset);

        db.query(sql, values, (err, rows)=>{

            if(err){

                console.log(err);

                return res.send("Database Error");

            }

            const published = rows.filter(
                b => b.status === "Published"
            ).length;

            const draft = rows.filter(
                b => b.status === "Draft"
            ).length;

            res.render("blogs",{

                blogs: rows,

                search,

                category,

                total: totalBlogs,

                published,

                draft,

                currentPage: page,

                totalPages

            });

        });

    });

};
// ==========================
// Open Edit Blog
// ==========================

exports.editPage = (req, res) => {

    const sql = `
        SELECT *
        FROM blogs
        WHERE id=?
        AND user_id=?
    `;

    db.query(

        sql,

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

                return res.send("Blog Not Found");

            }

            res.render("editBlog", {

                blog: rows[0]

            });

        }

    );

};
// ==========================
// Update Blog
// ==========================

exports.updateBlog = (req, res) => {

    const {

        title,
        slug,
        category,
        tags,
        content,
        status

    } = req.body;

let featuredImage = req.body.selectedImage || req.body.oldImage;

if (req.file) {

    featuredImage =
        "/uploads/blogs/" +
        req.file.filename;

}
    const checkSql = `
        SELECT id
        FROM blogs
        WHERE slug=?
        AND id<>?
    `;

    db.query(

        checkSql,

        [

            slug,
            req.params.id

        ],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            if (rows.length > 0) {

                return res.send("Slug already exists.");

            }

            const sql = `
                UPDATE blogs
                SET
                    title=?,
                    slug=?,
                    category=?,
                    tags=?,
                    featured_image=?,
                    content=?,
                    status=?
                WHERE id=?
                AND user_id=?
            `;

            db.query(

                sql,

                [

                    title,
                    slug,
                    category,
                    tags,
                    featuredImage,
                    content,
                    status,
                    req.params.id,
                    req.session.user.id

                ],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.send("Database Error");

                    }

                   logActivity(
    req.session.user.id,
    `Updated blog: ${title}`
);

res.redirect("/blogs");

                }

            );

        }

    );

};

// ==========================
// Delete Blog
// ==========================

exports.deleteBlog = (req, res) => {

    const sql = `
        DELETE FROM blogs
        WHERE id=?
        AND user_id=?
    `;

    db.query(

        sql,

        [

            req.params.id,

            req.session.user.id

        ],

        (err) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

           logActivity(
    req.session.user.id,
    "Deleted a blog"
);

res.redirect("/blogs");

        }

    );

};
// ==========================
// View Published Blog
// ==========================

exports.viewBlog = (req, res) => {

    const sql = `
        SELECT *
        FROM blogs
        WHERE slug=?
        AND status='Published'
    `;

    db.query(

        sql,

        [req.params.slug],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            if (rows.length === 0) {

                return res.send("Blog Not Found");

            }

            const blog = rows[0];

            db.query(

                `
                SELECT *
                FROM comments
                WHERE blog_id=?
                AND status='Approved'
                ORDER BY created_at DESC
                `,

                [blog.id],

                (err, comments) => {

                    if (err) {

                        console.log(err);

                        return res.send("Database Error");

                    }

                    res.render("viewBlog", {

                        blog,

                        comments

                    });

                }

            );

        }

    );

};