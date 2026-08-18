const db = require("../config/db");

exports.activityPage = (req, res) => {

    const sql = `
        SELECT 
            activity_logs.id,
            activity_logs.activity,
            activity_logs.created_at,
            users.username
        FROM activity_logs
        JOIN users
            ON activity_logs.user_id = users.id
        WHERE activity_logs.user_id = ?
        ORDER BY activity_logs.created_at DESC
    `;

    db.query(
        sql,
        [req.session.user.id],
        (err, logs) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.render("activity", {
                user: req.session.user,
                logs: logs
            });

        }
    );
};