const db = require("../config/db");
const logActivity = require("../utils/activityLogger");
const fs = require("fs");

const path = require("path");
// ==========================
// Media Library
// ==========================

exports.mediaPage = (req, res) => {

    const search = req.query.search || "";

    const sql = `
        SELECT *
        FROM media
        WHERE user_id=?
        AND file_name LIKE ?
        ORDER BY uploaded_at DESC
    `;

    db.query(

        sql,

        [

            req.session.user.id,

            "%" + search + "%"

        ],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.send("Database Error");

            }

            res.render("media", {

                media: rows,

                search

            });

        }

    );

};
// Upload Image

exports.uploadMedia = (req,res)=>{

    if(!req.file){

        return res.send("No File Uploaded");

    }

    const sql = `
    INSERT INTO media
    (
        user_id,
        file_name,
        file_path
    )
    VALUES(?,?,?)
    `;

    db.query(

        sql,

        [

            req.session.user.id,

            req.file.filename,

            "/uploads/media/" + req.file.filename

        ],

        (err)=>{

            if(err){

                console.log(err);

                return res.send("Database Error");

            }

      logActivity(
    req.session.user.id,
    `Uploaded media: ${req.file.filename}`
);

res.redirect("/media");

        }

    );

};
// ==========================
// Delete Media
// ==========================

exports.deleteMedia = (req, res) => {

    const sql = `
        SELECT *
        FROM media
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

                return res.send("Media Not Found");

            }

            const filePath = path.join(

                __dirname,

                "../public",

                rows[0].file_path

            );

            if (fs.existsSync(filePath)) {

                fs.unlinkSync(filePath);

            }

            db.query(

                "DELETE FROM media WHERE id=?",

                [req.params.id],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.send("Database Error");

                    }
                 logActivity(
    req.session.user.id,
    "Deleted a media file"
);

res.redirect("/media");
                }

            );

        }

    );

};
// ==========================
// Media List (JSON)
// ==========================

exports.mediaList = (req, res) => {

    const sql = `
        SELECT
            id,
            file_name,
            file_path
        FROM media
        WHERE user_id=?
        ORDER BY uploaded_at DESC
    `;

    db.query(

        sql,

        [req.session.user.id],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.json([]);

            }

            res.json(rows);

        }

    );

};
// ==========================
// View Single Media
// ==========================
exports.viewMedia = (req, res) => {

    const mediaSql = `
        SELECT *
        FROM media
        WHERE id=?
        AND user_id=?
    `;

    db.query(

        mediaSql,

        [

            req.params.id,

            req.session.user.id

        ],

        (err, mediaRows) => {

            if(err){

                console.log(err);

                return res.send("Database Error");

            }

            if(mediaRows.length===0){

                return res.send("Media Not Found");

            }

            const media = mediaRows[0];

            const blogSql = `
                SELECT
                    id,
                    title
                FROM blogs
                WHERE featured_image=?
            `;

            db.query(

                blogSql,

                [media.file_path],

                (err, blogs)=>{

                    if(err){

                        console.log(err);

                        return res.send("Database Error");

                    }

                    res.render("viewMedia",{

                        media,

                        blogs

                    });

                }

            );

        }

    );

};
// ==========================
// Bulk Delete Media
// ==========================

exports.deleteSelected = (req,res)=>{

    const ids = req.body.selectedMedia;

    if(!ids){

        return res.redirect("/media");

    }

    const selectedIds = Array.isArray(ids)

        ? ids

        : [ids];

    const sql = `
        SELECT *
        FROM media
        WHERE id IN (?)
        AND user_id=?
    `;

    db.query(

        sql,

        [

            selectedIds,

            req.session.user.id

        ],

        (err,rows)=>{

            if(err){

                console.log(err);

                return res.send("Database Error");

            }

            rows.forEach(file=>{

                const filePath = path.join(

                    __dirname,

                    "../public",

                    file.file_path

                );

                if(fs.existsSync(filePath)){

                    fs.unlinkSync(filePath);

                }

            });

            db.query(

                "DELETE FROM media WHERE id IN (?)",

                [selectedIds],

                (err)=>{

                    if(err){

                        console.log(err);

                        return res.send("Database Error");

                    }

                  logActivity(
    req.session.user.id,
    `Deleted ${selectedIds.length} media file(s)`
);

res.redirect("/media"); 
                }

            );

        }

    );

};