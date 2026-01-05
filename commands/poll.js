const { SlashCommandBuilder, discordSort, EmbedBuilder } = require('discord.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('poll')
		.setDescription('poll')
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('question')
                .setRequired(true)
            )
        .addIntegerOption(option =>
            option
                .setName('tid')
                .setDescription('tid i sekunder')
                .setRequired(true)
        ),

	async execute(interaction) {
        var user = interaction.user;
        let USER_ID = user.id;
        let USER_MENTION = "<@" + USER_ID + ">";
        var username = user.username + "#" + user.discriminator;
        QUESTIONE = interaction.options.getString('question');
        var TIME = interaction.options.getInteger('tid');
        if (TIME < 30) {
            await interaction.reply(USER_MENTION + ' Tiden måste vara minst 30 sekunder!')
            return;
        }

        MESSAGE = await interaction.reply({content: '>>> ' + '   **JÖRGPOLL** \n' + QUESTIONE, fetchReply: true});
        EMOJIS = ['👍', '👎'];

        for (var i=0; i < EMOJIS.length;i++) {
            MESSAGE.react(EMOJIS[i]);
        }

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name);
        };

        var THUMBSUP_COUNT = -1;
        var THUMBSDOWN_COUNT = -1;
        var THUMBSUP = EMOJIS[0];
        var THUMBSDOWN = EMOJIS[1];
        TIME = TIME * 1000;
        const collector = MESSAGE.createReactionCollector({ filter, time: TIME });
        var POLL_DICT = {};
        collector.on('collect', (reaction, user) => {
	        //console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if (reaction.emoji.name === '👍') {
                THUMBSUP_COUNT++;
            } else if (reaction.emoji.name === '👎') {
                THUMBSDOWN_COUNT++;
            }
        });

        collector.on('end', async collected => {

            if (THUMBSUP_COUNT > THUMBSDOWN_COUNT) {
                await MESSAGE.reply('>>> **' + QUESTIONE + '**\n' + '**JA**');
            } else if (THUMBSDOWN_COUNT > THUMBSUP_COUNT) {
                await MESSAGE.reply('>>> **' + QUESTIONE + '**\n' + '**NEJ**');
            } else {
                await MESSAGE.reply('>>> **' + QUESTIONE + '**\n' + ' **Det blev LIKA**');
            }
        });
	},
};