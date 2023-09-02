const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const gf = require('../general-functions.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('help')
		.setDescription('List of All Commands'),

	async execute(interaction) {
        var commandList = ["**/crproject** - *Create a new Project.*", "**/modproject** - *Modify existing project*", "**/delproject** - *Delete project*","**/upproject** - *Update Milestone within a Project.*",
                           "**/vwproject** - *View a Project*", "**/vwgprojects** - *View all projects within the guild*"];
        var commands = [];
        commandList.forEach(command => {
            var desc = command.split('-')[1];
            var command = command.split('-')[0];
            commands.push({name: command, value: desc, inline: false});
        });
        const helpembed = embedStyles.helpEmbed(commands);
        await interaction.reply({embeds: [helpembed]});
	},

};