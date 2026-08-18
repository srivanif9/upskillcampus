const db = require("../config/db");

// Open Settings Page
exports.settingsPage = (req, res) => {

    db.query(
        "SELECT * FROM settings WHERE user_id=?",
        [req.session.user.id],
        (err, rows) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.render("settings", {
                settings: rows.length ? rows[0] : {}
            });

        }
    );

};

// Save Settings
exports.saveSettings = (req, res) => {

    const {
        site_name,
        site_description
    } = req.body;

    const userId = req.session.user.id;

    db.query(
        "SELECT id FROM settings WHERE user_id=?",
        [userId],
        (err, rows) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            if (rows.length > 0) {

                db.query(
                    `UPDATE settings
                     SET site_name=?, site_description=?
                     WHERE user_id=?`,
                    [
                        site_name,
                        site_description,
                        userId
                    ],
                    err => {

                        if (err) {
                            console.log(err);
                            return res.send("Database Error");
                        }

                        res.redirect("/settings");

                    }
                );

            } else {

                db.query(
                    `INSERT INTO settings
                    (user_id,site_name,site_description)
                    VALUES(?,?,?)`,
                    [
                        userId,
                        site_name,
                        site_description
                    ],
                    err => {

                        if (err) {
                            console.log(err);
                            return res.send("Database Error");
                        }

                        res.redirect("/settings");

                    }
                );

            }

        }
    );

};