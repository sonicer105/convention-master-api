const config = require("config");
const mysql = require("mysql");
const ReportSponsor = require("../model/reportSponsor");

var connection = mysql.createConnection({
    host: config.get("mysql.host"),
    port: config.get("mysql.port"),
    user: config.get("mysql.username"),
    password: config.get("mysql.password"),
    database: config.get("mysql.database")
});

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('connected as id ' + connection.threadId);
// });

function getReportSponsor(callback){
    var eventId = config.get("conventionMaster.targetEventId");
    var sponsorMemberships = config.get("conventionMaster.sponsorMemberships");
    connection.query(`SELECT current_membership_type, badge_display_code, rl_first, rl_last, fan_name FROM events_attended ea
        LEFT JOIN registrant r ON ea.uid = r.uid
        LEFT JOIN account_balance_storage abs ON r.uid = abs.account_uid AND ea.event_id = abs.event_id
        WHERE ea.event_id = '${eventId}' AND shopping_cart_balance < 0.001 AND current_membership_type in ('${sponsorMemberships.join("','")}')
        ORDER BY r.uid;`,
        function (error, results) {
            if (error) {
                callback(error);
                return;
            }
            var toReturn = [];
            results.forEach(result => {
                toReturn.push(new ReportSponsor(
                    result.current_membership_type,
                    result.badge_display_code,
                    result.rl_first,
                    result.rl_last,
                    result.fan_name
                ));
            });
            callback(null, toReturn);
            connection.end();
        }
    );
}

module.exports = {
    getReportSponsor: getReportSponsor
};