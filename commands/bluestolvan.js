const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bluestolvan')
		.setDescription('bluestolvan'),
	async execute(interaction) {
        const bluestolvan_embed = new EmbedBuilder().setTitle('**Bluestolvan!**');
        bluestolvan_embed.setDescription('E7 E7 E7 E7\n\nA7 A7 E7 E7\n\nB7 A7 E7 E7');
        bluestolvan_embed.setColor(0x7289da);
		await interaction.reply({embeds: [bluestolvan_embed]});
	},
};