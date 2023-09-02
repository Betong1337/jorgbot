const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const gf = require('../general-functions.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('delproject')
		.setDescription('Delete Existing Project')
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
            var ProjectOwner = ProjectData.createdBy;

            if (ProjectOwner != interaction.user.username) {
                interaction.reply("You are not the owner of the project!");
                return;
            }

            const modal = new ModalBuilder()
			    .setCustomId('MCProjectModify')
			    .setTitle('Modify Project');

		    const ProjectDelConfirm = new TextInputBuilder()
                .setCustomId('MCProjectDelConfirm')
                .setLabel("Type 'DELETE' to confirm")
                .setMinLength(3)
                .setMaxLength(30)
                .setStyle(TextInputStyle.Short);
            
            const firstActionRow = new ActionRowBuilder().addComponents(ProjectDelConfirm);

            modal.addComponents(firstActionRow);

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

            let confirm_msg = submitted.fields.getTextInputValue('MCProjectDelConfirm');

            if (confirm_msg != 'DELETE') {
                await submitted.editReply("You need to type 'DELETE'!");
                return;
            }

            await db.delRecord(ProjectKey);
            await submitted.editReply("The Project has been deleted!");

        } catch (errror) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},

    

};