const { SlashCommandBuilder, discordSort } = require('discord.js');
const db = require('../db_connect.js');
const gb = require('../global_functions.js');
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
        
        //Check if user arg is not null
        if (interaction.options.getString('user') != null) {
            user_id = gb.getIDFromMention(interaction.options.getString('user'));
        }
        let user_mention = "<@" + user_id + ">";
        var user = interaction.user;
        var username = user.username + "#" + user.discriminator;

        db.IsUserInDatabase(user_id).then(async value => {
            if (value != true) {
                db.AddUserToDatabase(user_id, username);
            }
        }).catch(error => {
            console.log("BALANCE, IsUserInDatabase E: " + error);
        });

        db.getUserBalance(user_id).then(async value => {
            await interaction.reply(user_mention + ", Du har " + "**" +value + "**" + " JÖRGCOINS");
        }).catch(error => {
            console.log("BALANCE E: " + error);
        });

	},
};