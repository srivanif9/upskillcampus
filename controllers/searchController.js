const db = require("../config/db");

exports.searchPage = (req, res) => {

    res.render("search", {

        pages: [],

        blogs: [],

        media: [],

        keyword: ""

    });

};

exports.globalSearch = (req, res) => {

    const keyword = req.query.keyword || "";

    const like = "%" + keyword + "%";

    const userId = req.session.user.id;

    db.query(

        "SELECT id,page_name FROM pages WHERE user_id=? AND page_name LIKE ?",

        [userId, like],

        (err, pages) => {

            if (err) return res.send("Database Error");

            db.query(

                "SELECT id,title,slug FROM blogs WHERE user_id=? AND title LIKE ?",

                [userId, like],

                (err, blogs) => {

                    if (err) return res.send("Database Error");

                    db.query(

                        "SELECT id,file_name FROM media WHERE user_id=? AND file_name LIKE ?",

                        [userId, like],

                        (err, media) => {

                            if (err) return res.send("Database Error");

                            res.render("search", {

                                keyword,

                                pages,

                                blogs,

                                media

                            });

                        }

                    );

                }

            );

        }

    );

};