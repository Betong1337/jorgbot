const { SlashCommandBuilder, discordSort, EmbedBuilder, ConnectionVisibility } = require('discord.js');
const db = require('../db_connect.js');
const gb = require('../global_functions.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('leaderboard')
		.setDescription('leaderboard'),

	async execute(interaction) {
        let USER_ID = interaction.user.id;
        var AUTHOR_USERNAME = interaction.user.username + '#' + interaction.user.discriminator;

        if (interaction.options.getString('user') != null) {
            USER_ID = getIDFromMention(interaction.options.getString('user'));
        }
        db.IsUserInDatabase(USER_ID).then(async value => {
            if (value != true) {
                db.AddUserToDatabase(USER_ID, AUTHOR_USERNAME);
            }
        }).catch(error => {
            console.log("BALANCE, IsUserInDatabase E: " + error);
        });
        var LEADERBOARD_EMBED = new EmbedBuilder().setTitle('**JÖRGCOINS - TOP 10 LEADERBOARD**');
        const color = [0xdfff00, 0xffbf00, 0xff7f50, 0xde3163, 0x9fe2bf, 0x40e0d0, 0x6495ed, 0xccccff];
        LEADERBOARD_EMBED.setColor(gb.getRandomItem(color));
        db.getUserdataCoins().then(async USERDATA => {
            for (var key = 0; key < USERDATA.length; key++) {
                if (key === 10) {
                    break;
                }
                var row = USERDATA[key];
                var USERNAME = row.username;
                var USER_BALANCE = row.balance;
                var PLACEMENT = key + 1;
                var RESULT = '**' + PLACEMENT + '**. ' + USERNAME + ': **' + USER_BALANCE + '**' + ' JÖRGCOINS';
                LEADERBOARD_EMBED.addFields({ name: ' ', value: RESULT });
            }
            await interaction.reply({embeds: [LEADERBOARD_EMBED]});
        });
	},
};