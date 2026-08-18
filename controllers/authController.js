const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../config/db");
const logActivity = require("../utils/activityLogger");
// Register Page
exports.registerPage = (req, res) => {
    res.render("register");
};

// Login Page
exports.loginPage = (req, res) => {
    res.render("login");
};
// ==========================
// Forgot Password Page
// ==========================

exports.forgotPasswordPage = (req, res) => {

    res.render("forgotPassword");

};
// ==========================
// Forgot Password
// ==========================

exports.forgotPassword = (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.send("Please enter your email.");
    }

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, users) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            // Don't reveal whether an email exists
            if (users.length === 0) {

                return res.send(
                    "If an account with that email exists, a password reset link has been sent."
                );

            }

            const user = users[0];

            // Generate secure random token
            const resetToken = crypto.randomBytes(32).toString("hex");

            // Token expires after 15 minutes
            const expiry = new Date(
                Date.now() + 15 * 60 * 1000
            );

            db.query(
                `
                UPDATE users
                SET reset_token=?,
                    reset_token_expiry=?
                WHERE id=?
                `,
                [
                    resetToken,
                    expiry,
                    user.id
                ],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.send("Database Error");
                    }

                    const resetLink =
                        `http://localhost:3000/reset-password/${resetToken}`;

                    
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
});
                    const mailOptions = {

                        from: process.env.MAIL_USER,

                        to: user.email,

                        subject: "CMS Blog Builder - Password Reset",

                        html: `
                            <h2>Password Reset</h2>

                            <p>Hello ${user.username},</p>

                            <p>
                                We received a request to reset your
                                CMS Blog Builder password.
                            </p>

                            <p>
                                Click the button below to create
                                a new password:
                            </p>

                            <p>
                                <a href="${resetLink}"
                                   style="
                                   display:inline-block;
                                   padding:10px 20px;
                                   background:#2563eb;
                                   color:white;
                                   text-decoration:none;
                                   border-radius:5px;">
                                   Reset Password
                                </a>
                            </p>

                            <p>
                                This link will expire in
                                <b>15 minutes</b>.
                            </p>

                            <p>
                                If you did not request this,
                                you can safely ignore this email.
                            </p>
                        `

                    };

                    transporter.sendMail(
                        mailOptions,
                        (error) => {

                            if (error) {

                                console.log(error);

                                return res.send(
                                    "Unable to send reset email."
                                );

                            }

                            res.send(
                                "Password reset link has been sent to your email."
                            );

                        }
                    );

                }
            );

        }
    );

};
// ==========================
// Reset Password Page
// ==========================

exports.resetPasswordPage = (req, res) => {

    const { token } = req.params;

    db.query(
        `
        SELECT id
        FROM users
        WHERE reset_token=?
        AND reset_token_expiry > NOW()
        `,
        [token],
        (err, rows) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            if (rows.length === 0) {
                return res.send(
                    "This password reset link is invalid or has expired."
                );
            }

            res.render("resetPassword", {
                token
            });

        }
    );

};
// ==========================
// Reset Password
// ==========================

exports.resetPassword = async (req, res) => {

    const {
        token,
        newPassword,
        confirmPassword
    } = req.body;

    if (!newPassword || !confirmPassword) {
        return res.send("Please fill all fields.");
    }

    if (newPassword.length < 8) {
        return res.send(
            "Password must be at least 8 characters long."
        );
    }

    if (newPassword !== confirmPassword) {
        return res.send("Passwords do not match.");
    }

    db.query(
        `
        SELECT id
        FROM users
        WHERE reset_token=?
        AND reset_token_expiry > NOW()
        `,
        [token],
        async (err, rows) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            if (rows.length === 0) {
                return res.send(
                    "This password reset link is invalid or has expired."
                );
            }

            const userId = rows[0].id;

            const hash = await bcrypt.hash(
                newPassword,
                10
            );

            db.query(
                `
                UPDATE users
                SET password=?,
                    reset_token=NULL,
                    reset_token_expiry=NULL
                WHERE id=?
                `,
                [
                    hash,
                    userId
                ],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.send("Database Error");
                    }

                    logActivity(
                        userId,
                        "Password reset successfully"
                    );

                    res.send(`
                        <h2>Password Reset Successful</h2>

                        <p>
                            Your password has been changed successfully.
                        </p>

                        <a href="/login">
                            Go to Login
                        </a>
                    `);

                }
            );

        }
    );

};
// Register User
exports.register = async (req, res) => {
const { username, email, password, confirmPassword } = req.body;
if (password !== confirmPassword) {
    return res.send("Passwords do not match.");
}
    // Password Validation
    if (password.length < 8) {
        return res.send("Password must be at least 8 characters long.");
    }

    // Check duplicate username or email
    db.query(
        "SELECT * FROM users WHERE username=? OR email=?",
        [username, email],
        async (err, result) => {

            if (err) return res.send(err);

            if (result.length > 0) {
                return res.send("Username or Email already exists.");
            }

            const hash = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users(username,email,password) VALUES(?,?,?)",
                [username, email, hash],
                (err) => {

                    if (err) return res.send(err);

                    res.redirect("/login");
                }
            );
        }
    );
};

// Login User
exports.login = (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) return res.send(err);

            if (result.length === 0) {
                return res.send("User Not Found");
            }

            const valid = await bcrypt.compare(
                password,
                result[0].password
            );

            if (!valid) {
                return res.send("Incorrect Password");
            }
            req.session.user = result[0];

logActivity(
    result[0].id,
    "Logged in"
);

res.redirect("/dashboard");
        }
    );
};

// Dashboard
exports.dashboard = (req, res) => {

    res.render("dashboard", {
        user: req.session.user
    });

};

// Logout
exports.logout = (req, res) => {

    const userId = req.session.user
        ? req.session.user.id
        : null;

    if (userId) {

        logActivity(
            userId,
            "Logged out"
        );

    }

    req.session.destroy(() => {

        res.redirect("/login");

    });

};