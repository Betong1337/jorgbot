const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, discordSort, messageLink, Client, User } = require('discord.js');
const db = require('../utilities/db_connect.js');
const gb = require('../utilities/global_functions.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('inventory')
		.setDescription('Visa inventory'),

	async execute(interaction) {
        const user = interaction.user;
        const USER_ID = user.id;
        const USER_MENTION = "<@" + USER_ID + ">";
        const USERNAME = user.username;
        let guildID = interaction.guild.id;

        let IsUserInDB = await db.IsUserInDatabase(USER_ID, guildID)
        if (IsUserInDB === false) {
            if (gb.isValidUserId(USER_ID) === false) {
                await interaction.reply("Det där är ingen användare!")
                return;
            }
            await db.AddUserToDatabase(USER_ID, USERNAME, guildID);
        }

        let UserInventory = await db.GetUserInventory(USER_ID, guildID);

        var INVENTORY_EMBED = new EmbedBuilder().setTitle('**INVENTORY**');
        const color = [0xdfff00, 0xffbf00, 0xff7f50, 0xde3163, 0x9fe2bf, 0x40e0d0, 0x6495ed, 0xccccff];
        INVENTORY_EMBED.setColor(gb.getRandomItem(color));

        if (UserInventory.length === 0) {
            await interaction.reply("Du har inga saker i ditt inventory.");
            return;
        }

        for (let i=0;i<UserInventory.length;i++) {
            let item = "**" + UserInventory[i].item + "**";
            INVENTORY_EMBED.addFields({ name: ' ', value: item});
        }

        await interaction.reply({embeds: [INVENTORY_EMBED]});

	},
};