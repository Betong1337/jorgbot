const { User } = require('discord.js');
const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    multipleStatements: true
});

getUserBalance = async function(user_id, guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT balance FROM users WHERE user_id = ? AND guildid = ?', [user_id, guildid], function(err, rows) {
            if (err) return reject('getUserBalance: ' + err);
            resolve(rows.length > 0 ? rows[0].balance : null);
        });
    });
}

getUserQuizCooldown = async function(user_id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT quiz_cooldown FROM users WHERE user_id = ?', [user_id], function(err, rows) {
            if (err) return reject('getUserQuizCooldown: ' + err);
            resolve(rows.length > 0 ? rows[0].quiz_cooldown : null);
        });
    });
}

getUserDailyCooldown = async function(user_id, guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT daily_cooldown FROM users WHERE user_id = ? AND guildid = ?', [user_id, guildid], function(err, rows) {
            if (err) return reject('getUserDailyCooldown: ' + err);
            resolve(rows.length > 0 ? rows[0].daily_cooldown : null);
        });
    });
}

getAllQuestions = async function() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM questions', function(err, rows){
            if (err) return reject('getAllQuestions: ' + err);
            resolve(rows);
        });
    });
}

getUserdataQuiz = async function(user_id, guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT question_id FROM quiz_userdata WHERE user_id = ? AND guildid = ?', [user_id, guildid], function(err, rows) {
            if (err) return reject('getUserdataQuiz: ' + err);
            resolve(rows);
        });
    });
}

getUserdataCoins = async function(guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE guildid = ? ORDER BY balance DESC', [guildid], function(err, rows) {
            if (err) return reject('getUserdataCoins: ' + err);
            resolve(rows);
        });
    });
}

HaveUserAnsweredAllQuestions = async function(user_id, guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quiz_userdata WHERE user_id = ? AND guildid = ?; SELECT * FROM questions;', [user_id, guildid], function(err, results) {
            if (err) return reject('HaveUserAnsweredAllQuestions: ' + err);
            const USER_ANSWERED = results[0].length;
            const QUESTIONS_AMOUNT = results[1].length;
            resolve(USER_ANSWERED === QUESTIONS_AMOUNT);
        });
    });
}

GetUserProfile = async function(user_id, guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT balance, xp FROM users WHERE user_id = ? AND guildid = ?', [user_id, guildid], function(err, results) {
            if (err) return reject('GetUserProfile: ' + err);
            resolve(results);
        });
    });
}

SetUserDailyCooldown = async function(user_id, guildid) {
    pool.query('UPDATE users SET daily_cooldown = ? WHERE user_id = ? AND guildid = ?', [1, user_id, guildid], function(err) {
        if (err) throw new Error('SetUserDailyCooldown: ' + err);
    });
}

SetUserQuizCooldown = async function(user_id, guildID) {
    pool.query('UPDATE users SET quiz_cooldown = ? WHERE user_id = ? AND guildid = ?', [1, user_id, guildID], function(err) {
        if (err) throw new Error('SetUserQuizCooldown: ' + err);
    });
}

IsUserInDatabase = async function(user_id, guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE user_id = ? AND guildid = ?', [user_id, guildid], function(err, rows) {
            if (err) return reject('IsUserInDatabase: ' + err);
            resolve(rows.length > 0);
        });
    });
}

AddUserToDatabase = async function(user_id, username, guildid) {
    pool.query('INSERT INTO users (user_id, username, balance, daily_cooldown, quiz_cooldown, guildid) VALUES (?,?,?,?,?,?)', [user_id, username, 0, 0, 0, guildid], function(err) {
        if (err) throw new Error('AddUserToDatabase: ' + err);
    });
}

AddCoinsToUser = async function(user_id, amount, guildid) {
    try {
        const currentBalance = await getUserBalance(user_id, guildid);
        const newBalance = parseInt(currentBalance) + parseInt(amount);
        pool.query('UPDATE users SET balance = ? WHERE user_id = ? AND guildid = ?', [newBalance, user_id, guildid], function(err) {
            if (err) throw new Error('AddCoinsToUser: ' + err);
        });
    } catch (error) {
        console.log("AddCoinsToUser: " + error);
    }
}

AddUserToQuizUserdata = async function(user_id, qid, guildID) {
    pool.query('INSERT INTO quiz_userdata (user_id, question_id, guildid) VALUES (?,?,?)', [user_id, qid, guildID], function(err) {
        if (err) throw new Error('AddUserToQuizUserData: ' + err);
    });
}

getUserXP = async function(user_id, guildID) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT xp FROM users WHERE user_id = ? AND guildid = ?', [user_id, guildID], function(err, rows) {
            if (err) return reject('getUserXP: ' + err);
            resolve(rows.length > 0 ? rows[0].xp : 0);
        });
    });
}

AddXPToUser = async function(user_id, amount, guildid) {
    try {
        const currentXP = await getUserXP(user_id);
        const newXP = currentXP + amount;
        pool.query('UPDATE users SET xp = ? WHERE user_id = ? AND guildid = ?', [newXP, user_id, guildid], function(err) {
            if (err) throw new Error('AddXPToUser: ' + err);
        });
    } catch (error) {
        console.log("AddXPToUser: " + error);
    }
}

RemoveCoinsFromUser = async function(user_id, amount, guildid) {
    try {
        const currentBalance = await getUserBalance(user_id, guildid);
        const newBalance = parseInt(currentBalance) - parseInt(amount);
        pool.query('UPDATE users SET balance = ? WHERE user_id = ? AND guildid = ?', [newBalance, user_id, guildid], function(err) {
            if (err) throw new Error('RemoveCoinsFromUser: ' + err);
        });
    } catch (error) {
        console.log("RemoveCoinsFromUser: " + error);
    }
}

AddItemToUser = async function(user_id, item, guildid) {
    pool.query('INSERT INTO inventory (user_id, item, guildid) VALUES (?,?,?)', [user_id, item, guildid], function(err) {
        if (err) throw new Error('AddItemToUser: ' + err);
    });
}

GetUserInventory = async function(user_id, guildid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT item FROM inventory WHERE user_id = ? AND guildid = ?', [user_id, guildid], function(err, rows) {
            if (err) return reject('GetUserInventory: ' + err);
            resolve(rows);
        });
    });
}

RemoveItemFromUser = async function(user_id, item) {
    pool.query('DELETE FROM inventory WHERE user_id = ? AND item = ?', [user_id, item], function(err) {
        if (err) throw new Error('RemoveItemFromUser: ' + err);
    });
}

GetItemData = async function(itemid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM items WHERE itemid = ?', [itemid], function(err, rows) {
            if (err) return reject('GetItemData: ' + err);
            resolve(rows);
        });
    });
}

CheckWhatLevelUserIs = async function(userID, guildID) {
    const levelsData = require('./levelsystem.json');
    const levels = levelsData.levels;
        
    let UserXP = await getUserXP(userID, guildID);
    let UserXPLen = levels.length;
    let level;
    let CurrentLevel;
    let Rewards;
    let coinRewardIndex;
    let CoinReward;

    for(levelindex=0;levelindex<UserXPLen;levelindex++) {
        RequiredXP = levels[levelindex].required_xp;
        level = levels[levelindex].level;
        Rewards = level.rewards;
        CoinReward = Rewards[0].amount;
        if (UserXP >= RequiredXP) {
            CurrentLevel = level;
            AddCoinsToUser(userID, CoinReward, guildID);
        }
    }
    return CurrentLevel;
}

console.log(CheckWhatLevelUserIs('226664954873249795', '547509787143700486'));

module.exports = {
    getUserBalance,
    IsUserInDatabase,
    AddUserToDatabase,
    AddCoinsToUser,
    RemoveCoinsFromUser,
    getUserDailyCooldown,
    SetUserDailyCooldown,
    getUserQuizCooldown,
    getAllQuestions,
    HaveUserAnsweredAllQuestions,
    getUserdataQuiz,
    getUserdataCoins,
    AddUserToQuizUserdata,
    SetUserQuizCooldown,
    AddXPToUser,
    GetItemData,
    GetUserInventory,
    RemoveItemFromUser,
    AddItemToUser,
    GetUserProfile
};
