const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const gf = require('../general-functions.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('vwproject')
		.setDescription('View Project')
        .addStringOption(option =>
            option
                .setName('projectkey')
                .setDescription('projectkey')
                .setRequired(true)
        ),

	async execute(interaction) {
        try {
            var interactionOptions = interaction.options;
            var ProjectKey = interactionOptions.getString('projectkey');

            //Check if projectkey is valid
            let isvalid = await db.CheckProjectKeyDuplicate(ProjectKey);

            if (isvalid == false) {
                interaction.reply({content: "Projectkey is not valid!"});
                return;
            }

            //Check if MilestoneNumber is valid
            const ProjectData = await db.GetProject(ProjectKey);
            data = ProjectData[0];
            var MilestoneDict = JSON.parse(data.milestones);
            var MilestoneList = [];

            var ProjectName = data.title;
            var ProjectDescription = data.description;

            Object.keys(MilestoneDict).forEach(milestone => {
                MilestoneList.push(milestone);
            });
            let list = await gf.DictToEmbedList(MilestoneDict, MilestoneList);
            var embedList = list[0];
            var countList = list[1];

            var sum = countList[0] + countList[1];
            var andel = countList[0];
            var percentageDone = gf.PercentageOf(sum, andel);
            const projectEmbed = embedStyles.ProjectEmbed(ProjectName, ProjectDescription, ProjectKey, embedList, percentageDone);
        
            await interaction.reply({embeds: [projectEmbed]});

        } catch(error) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},

};