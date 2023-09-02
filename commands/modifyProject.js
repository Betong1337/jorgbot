const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const gf = require('../general-functions.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('modproject')
		.setDescription('Modify Existing Project')
        .addStringOption(option =>
            option
                .setName('projectkey')
                .setDescription('projectkey')
                .setRequired(true)
        ),

	async execute(interaction) {
        try {
            var interactionOptions = interaction.options;
            const ProjectKey = interactionOptions.getString('projectkey');
    
            let isProjectKeyValid = await db.CheckProjectKeyDuplicate(ProjectKey);
            if (!isProjectKeyValid) {
                await interaction.reply("Project Key is not valid!");
                return;
            }
            let data = await db.GetProject(ProjectKey);
            var ProjectData = data[0];
            var ProjectTitleModal = ProjectData.title;
            var ProjectDescriptionModal = ProjectData.description;
            var ProjectMilestonesIn = JSON.parse(ProjectData.milestones);
            var ProjectMilestonesModal = "";
            var ProjectOwner = ProjectData.createdBy;

            if (ProjectOwner != interaction.user.username) {
                interaction.reply("Ask the owner of the Project to modify! You do not have permission!"); 
                return;
            }
                
            ProjectMilestonesModal = gf.FromDictToString(ProjectMilestonesIn);

            const modal = new ModalBuilder()
			    .setCustomId('MCProjectModify')
			    .setTitle('Modify Project');

		    const ProjectNameInput = new TextInputBuilder()
                .setCustomId('MCProjectNameInput')
                .setLabel("Name of Project")
                .setValue(ProjectTitleModal)
                .setMinLength(3)
                .setMaxLength(30)
                .setStyle(TextInputStyle.Short);

            const ProjectDescriptionInput = new TextInputBuilder()
                .setCustomId('MCProjectDescriptionInput')
                .setLabel("Project Description")
                .setValue(ProjectDescriptionModal)
                .setMinLength(15)
                .setMaxLength(150)
                .setStyle(TextInputStyle.Paragraph);

            const ProjectMilestonesInput = new TextInputBuilder()
                .setCustomId('MCProjectMilestonesInput')
                .setLabel("Project Milestones")
                .setValue(ProjectMilestonesModal)
                .setMinLength(5)
                .setMaxLength(500)
                .setStyle(TextInputStyle.Paragraph);
            
            const firstActionRow = new ActionRowBuilder().addComponents(ProjectNameInput);
            const secondActionRow = new ActionRowBuilder().addComponents(ProjectDescriptionInput);
            const thirdActionRow = new ActionRowBuilder().addComponents(ProjectMilestonesInput);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

            await interaction.showModal(modal);

            const submitted = await interaction.awaitModalSubmit({
                time: 600000,

                filter: i => i.user.id === interaction.user.id,
            }).catch(error => {
                console.error(error)
            return null
            })
      
            if (!submitted) return;
            await submitted.deferReply();

            let ProjectNameMod = submitted.fields.getTextInputValue('MCProjectNameInput');
            let ProjectDescriptionMod = submitted.fields.getTextInputValue('MCProjectDescriptionInput');
            let ProjectMilestonesMod = submitted.fields.getTextInputValue('MCProjectMilestonesInput');

            if (ProjectNameMod != ProjectTitleModal) {
                await db.updateRecord("title", ProjectNameMod, ProjectKey);
            }
            if (ProjectDescriptionMod != ProjectDescriptionModal) {
                await db.updateRecord("description", ProjectDescriptionMod, ProjectKey);
            } 
            if (ProjectMilestonesMod != ProjectMilestonesModal) {
                let MilestoneList = ProjectMilestonesMod.split(',');

                let MilestoneDict = {};

                for (let i=0;i<MilestoneList.length;i++) {
                    let Milestone = i+1 + "." + " " + MilestoneList[i];
                    MilestoneDict[Milestone] = false;
                    MilestoneList[i] = Milestone;
                }
                const milestoneString = JSON.stringify(MilestoneDict);
                await db.updateRecord("milestones", milestoneString, ProjectKey);
            }
                
            await submitted.editReply("The Project has been modified!");
        } catch(error) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.")
        }
            
	},

    

};