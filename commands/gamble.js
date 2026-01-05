const { SlashCommandBuilder } = require('discord.js');
const db = require('../utilities/db_connect.js');
const gb = require('../utilities/global_functions.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('gamble')
		.setDescription('gamble')
        .addIntegerOption(option => 
            option
                .setName('belopp')
                .setDescription('Belopp')
                .setRequired(true)
            ),
            
	async execute(interaction) {

        let user = interaction.user;

        let user_id = user.id;
        let user_mention = "<@" + user_id + ">";
        let username = user.username;
        let belopp = interaction.options.getInteger('belopp');
        let random_int = gb.getRandomInt(10);
        let rare_random_int1 = gb.getRandomInt(200);
        let rare_random_int2 = gb.getRandomInt(200);
        let guildID = interaction.guild.id;

        if (interaction.options.getInteger('belopp') === null) {
            await interaction.reply(user_mention + " Du måste ange ett belopp!");
            return;
        }
        
        if (belopp < 1) {
            await interaction.reply(user_mention + " Du kan inte spela med 0 coins!");
            return;
        }

        let IsUserInDB = await db.IsUserInDatabase(user_id, guildID)
        if (IsUserInDB === false) {
            if (gb.isValidUserId(user_id, guildID) === false) {
                await interaction.reply("Det där är ingen användare!")
                return;
            }
            await db.AddUserToDatabase(user_id, username, guildID);
        }

        let UserBalance = await db.getUserBalance(user_id, guildID);

        if (parseInt(UserBalance) < 1 || parseInt(UserBalance) < belopp) {
            await interaction.reply(user_mention + " Du har inte råd din fattiga jävel!");
            return;
        }
        let vinst = belopp;

        if (rare_random_int1 == rare_random_int2) {
            vinst = vinst * 10;
            await interaction.reply(user_mention + "DU HAR VUNNIT *10 av din insatts!");
            await db.AddCoinsToUser(user_id, vinst, guildID);
            console.log(username + "RARE INTS WON");
            return;
        } else {
            console.log(username + " INT: " + random_int);
        }

        if (random_int < 6) {
            await interaction.reply(user_mention + "Du har vunnit **" + vinst + "** JÖRGCOINS!")
            await db.AddCoinsToUser(user_id, vinst, guildID);
            await db.AddXPToUser(user_id, 250, guildID);
            return;
        }
        await interaction.reply(user_mention + " AJFAN Du förlorade **" + belopp + "** JÖRGCOINS!");
        await db.RemoveCoinsFromUser(user_id, belopp, guildID);
        await db.AddXPToUser(user_id, 250, guildID);
	},
};