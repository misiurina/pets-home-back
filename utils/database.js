const config = require('config');
const mysql = require('mysql');
let connection = mysql.createConnection(config.get('mysqldb'));

function handleDisconnect() {
    connection = mysql.createConnection(config.get('mysqldb'));

    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

async function query(query) {
    handleDisconnect();
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, results, fields) {
            if (err) {
                return reject(new Error(`Could not execute ${query}:\n${err.message}`));
            } else {
                return resolve(results);
            }
        });
    });
}

function escape(string) {
    return connection.escape(string);
}

module.exports.query = query;
module.exports.escape = escape;