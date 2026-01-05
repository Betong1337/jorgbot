const { SlashCommandBuilder, discordSort } = require('discord.js');
const db = require('../utilities/db_connect.js');
const gb = require('../utilities/global_functions.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('profile')
		.setDescription('profile')
        .addStringOption(option =>
            option
                .setName('användare')
                .setDescription('Användare som du vill kolla profilen på.')
                .setRequired(false)
            ),

	async execute(interaction) {

        var USER = interaction.options.getString('användare');
        let UserID;
        let User;
        let Username;
        let Mention;
        if (USER == null) {
            UserID = interaction.user.id;
            Username = interaction.user.username;
            Mention = '<@' + interaction.user.id + '>';
        } else {
            UserID = gb.getIDFromMention(USER);
            User = interaction.client.users.cache.get(UserID);
            Username = User.tag;
            Mention = '<@' + UserID + '>'
        }

        var AUTHOR_MENTION = '<@' + interaction.user.id + '>';

        let guildID = interaction.guild.id;

        //If User to watch profie is in DB.
        let IsUserToGiveInDB = await db.IsUserInDatabase(UserID, guildID);
        if (IsUserToGiveInDB === false) {
            if (gb.isValidUserId(UserID, guildID) === false) {
                await interaction("Det där är ingen användare!");
                return;
            }
            await db.AddUserToDatabase(UserID, Username), guildID;
        }
        let UserData = await db.GetUserProfile(UserID, guildID);
        UserData = UserData[0];
        let UserBalance = UserData['balance'];
        let UserExp = UserData['xp'];

	},
};