const { EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    ProjectEmbed: function (ProjectName, ProjectDescription, ProjectKey, embedList, percentageDone) {
        return new EmbedBuilder()
            .setColor(0x00FF99)
            .setTitle(ProjectName)
            .setDescription(ProjectDescription)
            .addFields({ name: "Project Key", value: ProjectKey })
            .addFields({ name: 'Milestones', value: '\u0009' })
            .setThumbnail('https://i.imgur.com/qusTxuL.jpeg')
            .addFields(embedList)
            .addFields({ name: "Percentage Done", value: percentageDone + "%" })
            .setTimestamp();
    },
    viewAllGuildEmbed: function(guildName, embedList, page) {
        return new EmbedBuilder()
            .setColor(0x00FF99)
            .setTitle(guildName)
            .setDescription("All Guild Projects" + " Page: " + page)
            .addFields(embedList)
    },
    helpEmbed: function(commands) {
        return new EmbedBuilder()
            .setColor(0x00FF99)
            .setTitle("BTB Commands")
            .setDescription('List of All BTB Commands')
            .addFields(commands)
    }

};