const db = require("../config/db");

function logActivity(userId, activity) {

    db.query(

        "INSERT INTO activity_logs(user_id,activity) VALUES(?,?)",

        [userId, activity]

    );

}

module.exports = logActivity;