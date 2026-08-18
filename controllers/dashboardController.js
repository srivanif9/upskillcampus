const db = require("../config/db");

exports.dashboard = (req, res) => {

    const userId = req.session.user.id;

    const stats = {
        pages: 0,
        blogs: 0,
        media: 0
    };

    db.query(
        "SELECT COUNT(*) AS total FROM pages WHERE user_id=?",
        [userId],
        (err, pages) => {

            if (!err) stats.pages = pages[0].total;

            db.query(
                "SELECT COUNT(*) AS total FROM blogs WHERE user_id=?",
                [userId],
                (err, blogs) => {

                    if (!err) stats.blogs = blogs[0].total;

                    db.query(
                        "SELECT COUNT(*) AS total FROM media WHERE user_id=?",
                        [userId],
                        (err, media) => {

                            if (!err) stats.media = media[0].total;

                            res.render("dashboard", {
                                user: req.session.user,
                                stats
                            });

                        }
                    );

                }
            );

        }
    );

};