const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, discordSort, messageLink, Client, User } = require('discord.js');
const {generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const db = require('../utilities/db_connect.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('shop')
		.setDescription('shop')
        .addStringOption(option =>
			option.setName('items')
				.setDescription('item list')
				.setRequired(true)
				.addChoices(
					{ name: 'Pling Plong - 5.000JC', value: 'plingplong' },
					{ name: 'Pling Pling - 5.000JC', value: 'plingpling' },
					{ name: 'Birthday - 5.000JC', value: 'birthday' },
                    { name: 'Godmorgon - 5.000JC', value: 'godmorgon' },
                    { name: 'Ring Of Fire - 5.000JC', value: 'ring' },
                    { name: 'Blomstertid - 5.000JC', value: 'blomstertid' },
                    { name: 'Sommarvisa - 5.000JC', value: 'sommarvisa' },
                    { name: 'Baskomp - 5.000JC', value: 'baskomp' },
					{ name: "Semester Melodi - 5.000JC", value: "semestermelodi" }
				)),

	async execute(interaction) {
        const user = interaction.user;
        const USER_ID = user.id;
        const USER_MENTION = "<@" + USER_ID + ">";
		const username = user.username;
		let guildID = interaction.guild.id;

		let IsUserInDB = await db.IsUserInDatabase(USER_ID, guildID)
        if (IsUserInDB === false) {
            if (gb.isValidUserId(USER_ID) === false) {
                await interaction.reply("Det där är ingen användare!")
                return;
            }
            await db.AddUserToDatabase(USER_ID, username, guildID);
        }
		const itemToBuy = interaction.options.getString('items');
		let itemData = await db.GetItemData(itemToBuy);
		let UserBalance = await db.getUserBalance(USER_ID, guildID);
		itemData = itemData[0];
		const ItemCost = itemData.cost;

		if (UserBalance < ItemCost) {
			await interaction.reply(USER_MENTION + " Du har inte råd din fattiga jävel!");
			return;
		}

		let UserInventory = await db.GetUserInventory(USER_ID, guildID);

		for (let i=0;i<UserInventory.length;i++) {
			let item = UserInventory[i].item;
			if (item === itemToBuy) {
				await interaction.reply(USER_MENTION + " Du har redan den här prylen!");
				return;
			}
		}
		await db.RemoveCoinsFromUser(USER_ID, ItemCost, guildID);
		await db.AddItemToUser(USER_ID, itemToBuy, guildID);
		await interaction.reply(USER_MENTION + " Du har nu köpt **" + itemToBuy + "** För **" + ItemCost + "** JC!")
        
	},
};