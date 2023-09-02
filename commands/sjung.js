const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, discordSort, messageLink, Client } = require('discord.js');
const {generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const config = require('../config.json');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('sjung')
		.setDescription('sjung')
        .addStringOption(option =>
			option.setName('låtar')
				.setDescription('Låt Lista!')
				.setRequired(true)
				.addChoices(
					{ name: 'Baskomp', value: 'baskomp.mp3' },
					{ name: 'Birthday', value: 'birthday.mp3' },
					{ name: 'Blomstertid', value: 'blomstertid.mp3' },
                    { name: 'Godmorgon', value: 'godmorgon.mp3' },
                    { name: 'Pling Pling', value: 'pling.mp3' },
                    { name: 'Pling Plong', value: 'plong.mp3' },
                    { name: 'Ring of Fire', value: 'ring.mp3' },
                    { name: 'Sommarvisa', value: 'sommarvisa.mp3' },
				)),

	async execute(interaction) {

        const user_id = interaction.user.id;
        const user_mention = "<@" + user_id + ">";
        const path = "./mp3/";
        var song = path + interaction.options.getString('låtar');

        await interaction.reply("Inte färdig...");
	},
};