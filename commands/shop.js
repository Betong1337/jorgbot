const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, discordSort, messageLink, Client } = require('discord.js');
const {generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const config = require('../config.json');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('shop')
		.setDescription('shop')
        .addStringOption(option =>
			option.setName('items')
				.setDescription('item list')
				.setRequired(true)
				.addChoices(
					{ name: 'Item1', value: 'Item1Val' },
					{ name: 'Item2', value: 'Item2Val' },
					{ name: 'Item3', value: 'Item3Val' },
                    { name: 'Item4', value: 'Item4Val' },
                    { name: 'Item5', value: 'Item5Val' },
                    { name: 'Item6', value: 'Item6Val' },
                    { name: 'Item7', value: 'Item7Val' },
                    { name: 'Item8', value: 'Item8Val' },
				)),

	async execute(interaction) {
        const user = interaction.user;
        const USER_ID = user.id;
        const USER_MENTION = "<@" + USER_ID + ">";

        
	},
};