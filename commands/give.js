const { SlashCommandBuilder, discordSort } = require('discord.js');
const db = require('../utilities/db_connect.js');
const gb = require('../utilities/global_functions.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('give')
		.setDescription('give')
        .addStringOption(option =>
            option
                .setName('användare')
                .setDescription('Användare som du ska ge JC')
                .setRequired(true)
            )
        .addIntegerOption(option =>
            option
                .setName('belopp')
                .setDescription('Belopp som du ska ge')
                .setRequired(true)
            ),

	async execute(interaction) {

        USER_TO_GIVE_MENTION = interaction.options.getString('användare');
        AMOUNT_TO_GIVE = interaction.options.getInteger('belopp');

        let AUTHOR_USER_ID = interaction.user.id;
        let AUTHOR_USERNAME = interaction.user.username;
        var USER_MENTION = '<@' + interaction.user.id + '>';

        var USER_TO_GIVE_ID = gb.getIDFromMention(USER_TO_GIVE_MENTION);
        const USER_TO_GIVE = interaction.client.users.cache.get(USER_TO_GIVE_ID);
        const USER_TO_GIVE_USERNAME = USER_TO_GIVE.tag;

        let guildID = interaction.guild.id;

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

        //If Author of command is in the database
        let IsAuthorInDB = await db.IsUserInDatabase(AUTHOR_USER_ID, guildID);
        if (IsAuthorInDB === false) {
            if (gb.isValidUserId(user_id) === false) {
                await interaction.reply("Det där är ingen användare!")
                return;
            }
            await db.AddUserToDatabase(AUTHOR_USER_ID, AUTHOR_USERNAME, guildID);
        }

        //If User to give is in database.
        let IsUserToGiveInDB = await db.IsUserInDatabase(USER_TO_GIVE_ID, guildID);
        if (IsUserToGiveInDB === false) {
            if (gb.isValidUserId(USER_TO_GIVE_ID, guildID) === false) {
                await interaction("Det där är ingen användare!");
                return;
            }
            await db.AddUserToDatabase(USER_TO_GIVE_ID, USER_TO_GIVE_USERNAME), guildID;
        }

        let AUTHOR_BALANCE = await db.getUserBalance(AUTHOR_USER_ID, guildID);
        if (AUTHOR_BALANCE < AMOUNT_TO_GIVE) {
            await interaction.reply(USER_MENTION + "Du har inte råd din fattiga jävel!");
            return;
        }
        await db.AddXPToUser(AUTHOR_USER_ID, 250, guildID);
        await db.AddCoinsToUser(USER_TO_GIVE_ID, AMOUNT_TO_GIVE, guildID);
        await db.RemoveCoinsFromUser(AUTHOR_USER_ID, AMOUNT_TO_GIVE, guildID);
        await interaction.reply(USER_MENTION + " Har givit " + USER_TO_GIVE_MENTION + " **" + AMOUNT_TO_GIVE + "** JÖRGCOINS!")
        
	},
};