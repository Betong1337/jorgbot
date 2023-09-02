const { SlashCommandBuilder, discordSort } = require('discord.js');
const db = require('../db_connect.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('daily')
		.setDescription('daily'),

	async execute(interaction) {
        let user = interaction.user;
        let user_id = user.id;
        var username = user.username + "#" + user.discriminator;
        let user_mention = "<@" + user_id + ">";
        const daily_coins = 500;
        db.IsUserInDatabase(user_id).then(async value => {
            if (value != true) {
                db.AddUserToDatabase(user_id, username);
            }
        });
        db.getUserDailyCooldown(user_id).then(async cooldown => {
            if (cooldown == 1) {
                await interaction.reply(user_mention + " Cooldown reset: **KL 00.00**!")
                return;
            }
            db.AddCoinsToUser(user_id, daily_coins);
            db.SetUserDailyCooldown(user_id);
            await interaction.reply(user_mention + " Du har nu fått **" + daily_coins + " **JÖRGCOINS!");
            return;
        }).catch(error => {
            console.log("GAMBLE, IsUserInDatabase E: " + error);
        });
	},
};