const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const gb = require('../global_functions.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('selfie')
		.setDescription('selfie'),

	async execute(interaction) {
        
        //const user_id = interaction.user.id;
        //const user_mention = "<@" + user_id + ">";
        var files = fs.readdirSync('C:/Users/Jakob/Documents/jsbot/images')
        var selfie = "C:/Users/Jakob/Documents/jsbot/images/" + gb.getRandomItem(files);
        const attachment = new AttachmentBuilder(selfie);
        await interaction.reply({files: [attachment]})
	},
};