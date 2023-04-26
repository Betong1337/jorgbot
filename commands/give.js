const { SlashCommandBuilder, discordSort } = require('discord.js');
const db = require('../db_connect.js');
const gb = require('../global_functions.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('give')
		.setDescription('give')
        .addStringOption(option =>
            option
                .setName('användare')
                .setDescription('User to give JÖRGCOINS')
                .setRequired(true)
            )
        .addIntegerOption(option =>
            option
                .setName('belopp')
                .setDescription('belopp du vill ge')
                .setRequired(true)
            ),

	async execute(interaction) {

        USER_TO_GIVE_MENTION = interaction.options.getString('användare');
        AMOUNT_TO_GIVE = interaction.options.getInteger('belopp');

        let AUTHOR_USER_ID = interaction.user.id;
        let AUTHOR_USERNAME = interaction.user.username + '#' + interaction.user.discriminator;
        var USER_MENTION = '<@' + interaction.user.id + '>';
        var USER_TO_GIVE_ID = gb.getIDFromMention(USER_TO_GIVE_MENTION);

        if (USER_TO_GIVE_MENTION[0] + USER_TO_GIVE_MENTION[1] != '<@') {
            await interaction.reply(USER_MENTION + ' JA HALLÅ! **' + USER_TO_GIVE_MENTION + '** är inte en giltig användare!');
            return;
        }
        if (AMOUNT_TO_GIVE < 1) {
            await interaction.reply(USER_MENTION + " Du kan inte ge mindre än **1** JÖRGCOINS!");
            return;
        }
        if (USER_TO_GIVE_MENTION === USER_MENTION) {
            await interaction.reply(USER_MENTION + " Du kan inte ge dig själv JÖRGCOINS");
            return;
        }

        db.IsUserInDatabase(AUTHOR_USER_ID).then(async VALUE => {
            if (VALUE != true) {
                db.AddUserToDatabase(AUTHOR_USER_ID, AUTHOR_USERNAME);
            }
        }).catch(error => {
            console.log("GIVE, IsUserInDatabase E: " + error);
        });

        /*
        NEEDS TO GET USERNAME

        db.IsUserInDatabase(USER_TO_GIVE_ID).then(async value => {
            if (value != true) {
                db.AddUserToDatabase(USER_TO_GIVE_ID, USER_TO_GIVE_USERNAME);
            }
        }).catch(error => {
            console.log("GIVE, IsUserInDatabase E: " + error);
        });
        */

        db.getUserBalance(AUTHOR_USER_ID).then(async AUTHOR_BALANCE => {
            if (AUTHOR_BALANCE < AMOUNT_TO_GIVE) {
                await interaction.reply(USER_MENTION + " Du har inte råd din fattiga jävel!");
                return;
            }
            
            db.AddCoinsToUser(USER_TO_GIVE_ID, AMOUNT_TO_GIVE);
            db.RemoveCoinsFromUser(AUTHOR_USER_ID, AMOUNT_TO_GIVE);
            await interaction.reply(USER_MENTION + " Har givit " + USER_TO_GIVE_MENTION + " **" + AMOUNT_TO_GIVE + "** JÖRGCOINS!");
            return;

        }).catch(error => {
            console.log("GIVE, getUserBalance: " + error);
        });
        
	},
};