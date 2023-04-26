const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Jag visar en hjalplista!'),
	async execute(interaction) {
        function getRandomItem(arr) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            const item = arr[randomIndex];
            return item;
        }
        const HELP_EMBED = new EmbedBuilder().setTitle('**Hjälplista - JÖRGEN**');
        const color = [0xdfff00, 0xffbf00, 0xff7f50, 0xde3163, 0x9fe2bf, 0x40e0d0, 0x6495ed, 0xccccff];
        HELP_EMBED.addFields(
            {name: '/balance', value: 'Visar hur mycket JÖRGCOINS du har!'},
            {name: '/daily', value: 'Du får **500** JÖRGCOINS!'},
            {name: '/gamble', value: 'Du kan spela med dina JÖRGCOINS!'},
            {name: '/give', value: 'Du kan dela med dig av dina JÖRGCOINS'},
            {name: '/leaderboard', value: 'Visar en top 10 leaderboard av JÖRGCOINS'},
            {name: '/quiz', value: 'Du får en fråga om JÖRGEN'},
            {name: '/selfie', value: 'Jag visar en selfie på mig själv!'},
            {name: '/sjung', value: 'Jag sjunger en låt!'}
            );
        HELP_EMBED.setColor(getRandomItem(color));
		await interaction.reply({embeds: [HELP_EMBED]});
	},
};