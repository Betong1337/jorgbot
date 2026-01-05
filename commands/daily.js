const { SlashCommandBuilder, discordSort } = require('discord.js');
const db = require('../utilities/db_connect.js');
const gb = require('../utilities/global_functions.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('daily')
		.setDescription('daily'),

	async execute(interaction) {
        let user = interaction.user;
        let user_id = user.id;
        var username = user.username + "#" + user.discriminator;
        let user_mention = "<@" + user_id + ">";
        let guildID = interaction.guild.id;

        const daily_coins = 500;

        let IsUserInDB = await db.IsUserInDatabase(user_id, guildID)
        if (IsUserInDB === false) {
            if (gb.isValidUserId(user_id) === false) {
                await interaction.reply("Det där är ingen användare!")
                return;
            }
            await db.AddUserToDatabase(user_id, username, guildID);
        }

        let UserCooldown = await db.getUserDailyCooldown(user_id, guildID);

        if (UserCooldown == 1) {
            await interaction.reply(user_mention + " Cooldown reset: **KL 00.00**!")
            return;
        }
        
        await db.AddCoinsToUser(user_id, daily_coins, guildID);
        await db.SetUserDailyCooldown(user_id, guildID);
        await db.AddXPToUser(user_id, 250, guildID);
        await interaction.reply(user_mention + " Du har nu fått **" + daily_coins + " **JÖRGCOINS!");
        return;
	},
};