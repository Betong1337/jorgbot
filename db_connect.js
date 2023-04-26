const mysql = require('mysql');
const DBCONFIG = {
    host : 's',
    user : 's',
    password : 's',
    database : 's',
    multipleStatements: true
}

function handleDisconnect() {
    connection = mysql.createConnection(DBCONFIG); // Recreate the connection, since
                                                   // the old one cannot be reused.
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }

getUserBalance = function(user_id,) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);

        conn.query('SELECT balance FROM users WHERE user_id = ?', [user_id, ], function(err, rows) {
        if (err) throw new Error('getUserBalance: ' + err);
            
            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                resolve(row.balance);
            });
        });
        handleDisconnect();
    });
}

getUserQuizCooldown = function(user_id, ) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('SELECT quiz_cooldown FROM users WHERE user_id = ?', [user_id, ], function(err, rows) {
            if (err) throw new Error('getUserQuizCooldown: ' + err);

            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                resolve(row.quiz_cooldown);
            });
            handleDisconnect();
        });
    });
}

getUserDailyCooldown = function(user_id, ) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('SELECT daily_cooldown FROM users WHERE user_id = ?', [user_id, ], function(err, rows) {
            if (err) throw new Error('getUserQuizCooldown: ' + err);

            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                resolve(row.daily_cooldown);
            });
            handleDisconnect();
        });
    });
}

getAllQuestions = function() {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('SELECT * FROM questions', function(err, rows){
            if (err) throw new Error('getAllQuestions: ' + err);
            resolve(rows);
        });
        handleDisconnect();
        return;
    });
}

getUserdataQuiz = function(user_id, ) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('SELECT question_id FROM quiz_userdata WHERE user_id = ?', [user_id, ], function(err, rows) {
            if (err) throw new Error('getUserdataQuiz: ' + err);
            resolve(rows);
        });
        handleDisconnect();
        return;
    });
}
getUserdataCoins = function() {
    return new Promise (resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('SELECT * FROM users ORDER BY balance DESC', function(err, rows) {
            if (err) throw new Error('getUserdataCoins: ' + err);
            resolve(rows);
        });
        handleDisconnect()
    });
}

HaveUserAnsweredAllQuestions = function(user_id,) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('SELECT * FROM quiz_userdata WHERE user_id = ?; SELECT * FROM questions;', [user_id,], function(err, results) {
            if (err) throw new Error('HaveUserAnsweredALlQuestions: ' + err);
            var USER_ANSWERED = results[0].length;
            var QUESTIONS_AMOUNT = results[1].length; 
            
            if (USER_ANSWERED === QUESTIONS_AMOUNT) {
                resolve(true);
                return;
            }
            resolve(false);
            return;
        });
        handleDisconnect();
    });
}

SetUserDailyCooldown = function(user_id,) {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('UPDATE users SET daily_cooldown = ? WHERE user_id = ?', [1, user_id], function(err) {
            if (err) throw new Error('SetUserDailyCooldown: ' + err);
        });
        conn.commit();
        handleDisconnect();
}

SetUserQuizCooldown = function(user_id,) {
    var conn = mysql.createConnection(DBCONFIG);
    conn.query('UPDATE users SET quiz_cooldown = ? WHERE user_id = ?', [1, user_id], function(err) {
        if (err) throw new Error('SetUserDailyCooldown: ' + err);
    });
    conn.commit();
    handleDisconnect();
}

IsUserInDatabase = function(user_id,) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('SELECT * FROM users WHERE user_id = ?', [user_id, ], function(err, rows) {
            if (err) throw new Error('IsUserInDatabase: ' + err);
            if (rows.length == 0) {
                resolve(false);
                return;
            }
            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                var database_id = row.user_id;
                if (database_id === user_id) {
                    resolve(true);
                }
             });
        });
        handleDisconnect();
    });
}

AddUserToDatabase = function(user_id, username) {
    var conn = mysql.createConnection(DBCONFIG);
    conn.query('INSERT INTO users (user_id, username, balance ,daily_cooldown, quiz_cooldown) VALUES (?,?,?,?,?)', [user_id, username, 0, 0, 0], function(err){
        if (err) throw new Error('AddUserToDatabase: ' + err);
    });
    conn.commit();
    handleDisconnect();
}

AddCoinsToUser = function(user_id, amount) {
    getUserBalance(user_id).then(value => {
        amount = parseInt(amount);
        let user_balance = parseInt(value);
        amount = user_balance + amount;

        var conn = mysql.createConnection(DBCONFIG);
        conn.query('UPDATE users SET balance = ? WHERE user_id = ?', [amount, user_id], function(err) {
            if (err) throw new Error('AddCoinsToUser: ' + err);
        });
    conn.commit();
    handleDisconnect();
    }).catch(error => {
        console.log("AddCoinsToUser: " + error);
    });
}

AddUserToQuizUserdata = function(user_id, qid) {
    var conn = mysql.createConnection(DBCONFIG);
    conn.query('INSERT INTO quiz_userdata (user_id, question_id) VALUES (?,?)', [user_id, qid], function(err) {
        if (err) throw new Error('AddUserToQuizUserData: ' + err);
    });
    conn.commit();
    handleDisconnect();
}

getUserXP = function(user_id,) {
    var conn = mysql.createConnection(DBCONFIG);
    conn.query('SELECT xp FROM users WHERE user_id = ?', [user_id,], function(err, results) {
        if (err) throw new Error('getUserXP: ' + err);
        var xp = results.xp;
        resolve(xp);
    });
    handleDisconnect();
}

AddXPToUser = function(user_id, amount) {
    var conn = mysql.createConnection(DBCONFIG);
    getUserXP(user_id).then(xp => {
        amount = xp + amount;
        conn.query('UPDATE users SET xp = ? WHERE user_id = ?', [amount, user_id], function(err) {
            if (err) throw new Error('AddXPToUser: ' + err);
        });
        conn.commit();
        handleDisconnect();
    });
}

RemoveCoinsFromUser = function(user_id, amount) {
    getUserBalance(user_id).then(value => {
        amount = parseInt(amount);
        let user_balance = parseInt(value);
        amount = user_balance - amount;
        var conn = mysql.createConnection(DBCONFIG);
        conn.query('UPDATE users SET balance = ? WHERE user_id = ?', [amount, user_id], function(err) {
            if (err) throw new Error('AddCoinsToUser: ' + err);
        });
    conn.commit();
    handleDisconnect();
    }).catch(error => {
        console.log("AddCoinsToUser: " + error);
    });
}

module.exports = { getUserBalance, IsUserInDatabase, AddUserToDatabase,
                   AddCoinsToUser, RemoveCoinsFromUser, getUserDailyCooldown, 
                   SetUserDailyCooldown, getUserQuizCooldown, getAllQuestions, 
                   HaveUserAnsweredAllQuestions, getUserdataQuiz, getUserdataCoins, 
                   AddUserToQuizUserdata, SetUserQuizCooldown };