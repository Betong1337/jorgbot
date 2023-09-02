const { SlashCommandBuilder } = require('discord.js');
const db = require('../db_connect.js');
const gb = require('../global_functions.js');
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
        let username = user.username + "#" + user.discriminator;
        let belopp = interaction.options.getInteger('belopp');
        let random_int = gb.getRandomInt(10);
        let rare_random_int1 = gb.getRandomInt(200);
        let rare_random_int2 = gb.getRandomInt(200);

        if (interaction.options.getInteger('belopp') === null) {
            await interaction.reply(user_mention + " Du måste ange ett belopp!");
            return;
        }
        
        if (belopp < 1) {
            await interaction.reply(user_mention + " Du kan inte spela med 0 coins!");
            return;
        }
        db.IsUserInDatabase(user_id).then(async value => {
            if (value != true) {
                db.AddUserToDatabase(user_id, username);
            }
        }).catch(error => {
            console.log("GAMBLE, IsUserInDatabase E: " + error);
        });

        db.getUserBalance(user_id).then(async value => {
            if (parseInt(value) < 1 || parseInt(value) < belopp) {
                await interaction.reply(user_mention + " Du har inte råd din fattiga jävel!");
                return;
            }
            var vinst = belopp;

            if (rare_random_int1 == rare_random_int2) {
                vinst = vinst * 10;
                await interaction.reply(user_mention + " DU HAR VUNNIT *10 av din insatts!");
                db.AddCoinsToUser(user_id, vinst);
                console.log(username + "RARE INTS WON");
                return;
            } else {
                console.log(username + " INT: " + random_int);
            }
    
            if (random_int < 6) {
                await interaction.reply(user_mention + " Du har vunnit **" + vinst + "** JÖRGCOINS!");
                db.AddCoinsToUser(user_id, vinst);
                return;
            }
            await interaction.reply(user_mention + " AJFAN Du förlorade **" + belopp + "** JÖRGCOINS!");
            db.RemoveCoinsFromUser(user_id, belopp);

            }).catch(error => {
                console.log("GAMBLE getUserBalance: " + error);
        });
        return;
	},
};