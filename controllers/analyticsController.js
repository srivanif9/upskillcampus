const db = require("../config/db");

exports.analyticsPage = (req, res) => {

    const stats = {};

    db.query("SELECT COUNT(*) total FROM pages", (err, pages) => {

        stats.pages = pages[0].total;

        db.query("SELECT COUNT(*) total FROM blogs", (err, blogs) => {

            stats.blogs = blogs[0].total;

            db.query("SELECT COUNT(*) total FROM media", (err, media) => {

                stats.media = media[0].total;

                db.query("SELECT COUNT(*) total FROM contacts", (err, contacts) => {

                    stats.contacts = contacts[0].total;

                    db.query("SELECT COUNT(*) total FROM comments", (err, comments) => {

                        stats.comments = comments[0].total;

                        res.render("analytics", {
                            user: req.session.user,
                            stats
                        });

                    });
                });
            });
        });
    });
};