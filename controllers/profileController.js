const db = require("../config/db");
const bcrypt = require("bcrypt");
exports.profilePage = (req, res) => {

    const sql = `
        SELECT
            id,
            username,
            email,
            image
        FROM users
        WHERE id=?
    `;

    db.query(
        sql,
        [req.session.user.id],
        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            if (rows.length === 0) {

                return res.send("User Not Found");

            }

            res.render("profile", {

                user: rows[0]

            });

        }
    );

};
// ==========================
// Edit Profile Page
// ==========================

exports.editProfilePage = (req, res) => {

    db.query(

        "SELECT * FROM users WHERE id=?",

        [req.session.user.id],

        (err, rows)=>{

            if(err){

                console.log(err);

                return res.send("Database Error");

            }

            res.render("editProfile",{

                user: rows[0]

            });

        }

    );

};

// ==========================
// Update Profile
// ==========================
exports.updateProfile = (req, res) => {

    const { username, email } = req.body;

    let image = req.body.oldImage || "";

    if(req.file){
        image = "/uploads/profile/" + req.file.filename;
    }

    const checkSql = `
        SELECT id
        FROM users
        WHERE (username=? OR email=?)
        AND id<>?
    `;

    db.query(

        checkSql,

        [

            username,
            email,
            req.session.user.id

        ],

        (err, rows)=>{

            if(err){

                console.log(err);

                return res.send("Database Error");

            }

            if(rows.length > 0){

                return res.send(
                    "<script>alert('Username or Email already exists. Please choose another.');window.history.back();</script>"
                );

            }

            const sql = `
                UPDATE users
                SET
                    username=?,
                    email=?,
                    image=?
                WHERE id=?
            `;

            db.query(

                sql,

                [

                    username,
                    email,
                    image,
                    req.session.user.id

                ],

                (err)=>{

                    if(err){

                        console.log(err);

                        return res.send("Database Error");

                    }

                    req.session.user.username = username;

                    res.redirect("/profile");

                }

            );

        }

    );

};
// ==========================
// Change Password Page
// ==========================

exports.changePasswordPage = (req, res) => {

    res.render("changePassword");

};

// ==========================
// Change Password
// ==========================

exports.changePassword = (req, res) => {

    const {

        currentPassword,
        newPassword,
        confirmPassword

    } = req.body;

    if(newPassword !== confirmPassword){

        return res.send(
            "<script>alert('Passwords do not match');window.history.back();</script>"
        );

    }

    db.query(

        "SELECT password FROM users WHERE id=?",

        [req.session.user.id],

        async (err, rows)=>{

            if(err){

                console.log(err);

                return res.send("Database Error");

            }

            const match = await bcrypt.compare(

                currentPassword,

                rows[0].password

            );

            if(!match){

                return res.send(
                    "<script>alert('Current password is incorrect');window.history.back();</script>"
                );

            }

            const hashedPassword = await bcrypt.hash(

                newPassword,

                10

            );

            db.query(

                "UPDATE users SET password=? WHERE id=?",

                [

                    hashedPassword,

                    req.session.user.id

                ],

                (err)=>{

                    if(err){

                        console.log(err);

                        return res.send("Database Error");

                    }

                    res.send(
                        "<script>alert('Password updated successfully');window.location='/profile';</script>"
                    );

                }

            );

        }

    );

};
// ==========================
// Delete Account Page
// ==========================

exports.deleteAccountPage = (req, res) => {

    res.render("deleteAccount");

};


// ==========================
// Delete Account Permanently
// ==========================

exports.deleteAccount = (req, res) => {

    const { currentPassword, confirmation } = req.body;

    const userId = req.session.user.id;

    if (confirmation !== "DELETE") {

        return res.send(
            "<script>alert('Please type DELETE to confirm account deletion.');window.history.back();</script>"
        );

    }

    db.query(

        "SELECT password FROM users WHERE id=?",

        [userId],

        async (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            if (rows.length === 0) {

                return res.send("User Not Found");

            }

            const match = await bcrypt.compare(
                currentPassword,
                rows[0].password
            );

            if (!match) {

                return res.send(
                    "<script>alert('Current password is incorrect.');window.history.back();</script>"
                );

            }

            // Delete user's pages
            db.query(
                "DELETE FROM pages WHERE user_id=?",
                [userId],
                (err) => {

                    if (err) {

                        console.log(err);

                        return res.send("Database Error");

                    }

                    // Delete user's blogs
                    db.query(
                        "DELETE FROM blogs WHERE user_id=?",
                        [userId],
                        (err) => {

                            if (err) {

                                console.log(err);

                                return res.send("Database Error");

                            }

                            // Delete user's media records
                            db.query(
                                "DELETE FROM media WHERE user_id=?",
                                [userId],
                                (err) => {

                                    if (err) {

                                        console.log(err);

                                        return res.send("Database Error");

                                    }

                                    // Delete user
                                    // Activity logs will be deleted
                                    // automatically because of ON DELETE CASCADE
                                    db.query(
                                        "DELETE FROM users WHERE id=?",
                                        [userId],
                                        (err) => {

                                            if (err) {

                                                console.log(err);

                                                return res.send("Database Error");

                                            }

                                            // Destroy login session
                                            req.session.destroy(() => {

                                                res.redirect("/login");

                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};