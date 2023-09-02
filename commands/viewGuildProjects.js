const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const gf = require('../general-functions.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('vwgprojects')
		.setDescription('View Guild Projects')
        .addIntegerOption(option => 
            option
                .setName('page')
                .setDescription("Select Page")
                .setRequired(true)
        ),
        
	async execute(interaction) {

        function chunkArray(array, chunkSize) {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              result.push(array.slice(i, i + chunkSize));
            }
            return result;
          }
        try {
            var guildID = interaction.guild.id;
            var embedList = [];
            var guildName = interaction.guild.name;
            var guildName = guildName + "'s Projects";
            const pageNumber = interaction.options.getInteger("page") - 1;
            if (pageNumber < 0) {
                await interaction.reply("Page number can't be below 1!");
                return;
            }
            const GuildData = await db.GetGuildProjects(guildID);

            for(let i=0;i<GuildData.length;i++) {
                var title = gf.limitStringLength(GuildData[i].title, 20);
                var projectkey = GuildData[i].projectkey;
                var timestamp = JSON.stringify(GuildData[i].time_created);
                var dateCreated = timestamp.split('T')[0];
                dateCreated = dateCreated.replace('"', "");
                var createdBy = gf.limitStringLength(GuildData[i].createdBy, 18);

                embedList.push({name: title, value: createdBy, inline: true},
                            {name: "Project Key", value: projectkey, inline: true},
                            {name: "Date Created", value: dateCreated, inline: true});
            }
            const pages = chunkArray(embedList, 15);
            const pagelength = pages.length;

            if (pageNumber+1 > pagelength) {
                await interaction.reply("That many pages dosen't exist!");
                return;
            }

            const projectEmbed = embedStyles.viewAllGuildEmbed(guildName, pages[pageNumber], pageNumber+1);

            await interaction.reply({embeds: [projectEmbed]});

        } catch(error) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},

};