const { SlashCommandBuilder, discordSort } = require('discord.js');
const db = require('../utilities/db_connect.js');
const gb = require('../utilities/global_functions.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('balance')
		.setDescription('balance')
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('balance')
            ),
	async execute(interaction) {
        let user_id = interaction.user.id;
        let guildID = interaction.guild.id;
        
        //Check if user arg is not null
        if (interaction.options.getString('user') != null) {
            usermen = interaction.options.getString('user');
            user_id = gb.getIDFromMention(interaction.options.getString('user'));
        }

        let user_mention = "<@" + user_id + ">";
        var user = interaction.user;
        var username = user.username;
        let IsUserInDB = await db.IsUserInDatabase(user_id, guildID)
        if (IsUserInDB === false) {
            if (gb.isValidUserId(user_id) === false) {
                await interaction.reply("Det där är ingen användare!")
                return;
            }
            await db.AddUserToDatabase(user_id, username, guildID);
        }
        let Userbalance = await db.getUserBalance(user_id, guildID);
        await interaction.reply(user_mention + ", har " + "**" + Userbalance + "**" + " JÖRGCOINS");


	},
};