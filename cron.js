const cron = require('node-cron');
const mysql = require('mysql');
require('dotenv').config();

const db_host = process.env.DATABASE_HOST;
const db_user = process.env.DATABASE_USER;
const db_pass = process.env.DATABASE_PASS;
const db_name = process.env.DATABASE_NAME;

const pool = mysql.createPool({
    connectionLimit: 10,
    host : db_host,
    user : db_user,
    password : db_pass,
    database : db_name,
    multipleStatements: true
});

function resetDaily() {
    const sql = 'UPDATE users SET daily_cooldown = ? WHERE daily_cooldown = ?';
    const vars = [0, 1];

    pool.query(sql, vars, (err, results) => {
        if (err) throw err;
        console.log('Daily Cooldown reset!');
    });
}

function resetQuiz() {
    const sql = 'UPDATE users SET quiz_cooldown = ? WHERE quiz_cooldown = ?'
    const vars = [0, 1];
    pool.query(sql, vars, (err, results) => {
        if (err) throw err;
        console.log('Quiz reset!');
    });
}

console.log("Cron jobs has been started.");
cron.schedule('0 0 * * *', () => {
  console.log('Running daily reset at 00:00');
  resetDaily();
});

// Schedule a job to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('Running reset every 10 minutes');
  resetQuiz();
});
