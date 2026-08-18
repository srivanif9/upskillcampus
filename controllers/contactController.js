const db = require("../config/db");

// ==========================
// Public Contact Page
// ==========================

exports.contactPage = (req, res) => {

    res.render("contact");

};

// ==========================
// Save Contact Message
// ==========================

exports.saveMessage = (req, res) => {

    const {

        name,
        email,
        subject,
        message

    } = req.body;

    if (!name || !email || !subject || !message) {

        return res.send("Please fill all fields.");

    }

    const sql = `
        INSERT INTO contacts
        (
            name,
            email,
            subject,
            message
        )
        VALUES(?,?,?,?)
    `;

    db.query(

        sql,

        [

            name,
            email,
            subject,
            message

        ],

        (err) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.send("Message Sent Successfully");

        }

    );

};

// ==========================
// Contact List
// ==========================

exports.contactList = (req, res) => {

    const sql = `
        SELECT *
        FROM contacts
        ORDER BY created_at DESC
    `;

    db.query(

        sql,

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.render("contactList", {

            contacts: rows,
            user: req.session.user

        });

        }

    );

};

// ==========================
// View Contact Message
// ==========================

exports.viewMessage = (req, res) => {

    const sql = `
        SELECT *
        FROM contacts
        WHERE id=?
    `;

    db.query(

        sql,

        [req.params.id],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            if (rows.length === 0) {

                return res.send("Message Not Found");

            }

            res.render("contact", {

                contact: rows[0]

            });

        }

    );

};

// ==========================
// Mark As Read
// ==========================

exports.markRead = (req, res) => {

    const sql = `
        UPDATE contacts
        SET is_read='Yes'
        WHERE id=?
    `;

    db.query(

        sql,

        [req.params.id],

        (err) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.redirect("/contacts");

        }

    );

};

// ==========================
// Delete Message
// ==========================

exports.deleteMessage = (req, res) => {

    const sql = `
        DELETE
        FROM contacts
        WHERE id=?
    `;

    db.query(

        sql,

        [req.params.id],

        (err) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.redirect("/contacts");

        }

    );

};