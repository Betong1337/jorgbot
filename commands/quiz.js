const { SlashCommandBuilder, discordSort, EmbedBuilder, ComponentType, messageLink, userMention } = require('discord.js');
const db = require('../db_connect.js');
const gb = require('../global_functions.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('quiz')
		.setDescription('quiz'),

	async execute(interaction) {

        function HaveUserAnsweredQuestion(USER_DATA, QUESTION_ID) {
            for(var i=0; i < USER_DATA.length; i++) {
                var USER_DATA_QID = parseInt(USER_DATA[i].question_id);
                if (USER_DATA_QID === QUESTION_ID) {
                    return true;
                }
            }
            return false;
        }
        let USER_ID = interaction.user.id;
        let USER_MENTION = "<@" + USER_ID + ">";
        let USERNAME = interaction.user.username + "#" + interaction.user.discriminator;
        db.getUserQuizCooldown(USER_ID).then(async COOLDOWN => {
            if (COOLDOWN === 1) {
                await interaction.reply(USER_MENTION + " Du har en cooldown, vänta 5 min!");
                return;
            }
           
        db.IsUserInDatabase(USER_ID).then(async result => {
            if (result === false) {
                db.AddUserToDatabase(USER_ID, USERNAME);
            }

            db.getAllQuestions().then( async QUESTIONS => {
                var QUESTION_DATA = gb.getRandomItem(QUESTIONS);
                var QUESTION_ID = QUESTION_DATA.id;

                db.getUserdataQuiz(USER_ID).then( async USER_DATA => {
                    var x = HaveUserAnsweredQuestion(USER_DATA, QUESTION_ID);
                    while (x != false) {
                        QUESTION_DATA = gb.getRandomItem(QUESTIONS);
                        QUESTION_ID = QUESTION_DATA.question_id;
                        x = HaveUserAnsweredQuestion(USER_DATA, QUESTION_ID);
                    }

                    db.HaveUserAnsweredAllQuestions(USER_ID).then(async RESULT => {
                        if (RESULT === true) {
                            await interaction.reply(USER_MENTION + " Du har redan svarat rätt på alla frågor!");
                            return;
                        }
                    }).catch(error => {
                        console.log('QUIZ, HaveUserAnsweredAllQuestions: ' + error);
                    });

                    QUESTION = QUESTION_DATA.question;
                    QUESTION_ID = QUESTION_DATA.id;
                    QUESTION_ANSWER = QUESTION_DATA.answer1;
                    QUESTION_ANSWER_LIST = [QUESTION_DATA.answer2, QUESTION_DATA.answer3, QUESTION_DATA.answer1];
                    QUESTION_VALUE = QUESTION_DATA.value;

                    QUESTION_ANSWER_LIST = gb.shuffleArray(QUESTION_ANSWER_LIST);

                    const QUESTION_EMBED = new EmbedBuilder().setTitle(QUESTION + " **" + QUESTION_VALUE + "** JÖRGCOINS");
                    QUESTION_EMBED.setDescription('1. ' + QUESTION_ANSWER_LIST[0] + '\n' + '2. ' + QUESTION_ANSWER_LIST[1] + '\n' + '3. ' + QUESTION_ANSWER_LIST[2]);
                    QUESTION_EMBED.setColor(0x7289da);
                    const MESSAGE = await interaction.reply({embeds: [QUESTION_EMBED], fetchReply: true});
                    EMOJIS = ['1️⃣', '2️⃣', '3️⃣'];
                    for (var i=0; i < EMOJIS.length;i++) {
                        MESSAGE.react(EMOJIS[i]);
                    }
                    const filter = (reaction, user) => {
                        return ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && user.id === interaction.user.id;
                    };
                    var BOUND_ANSWERS = {'1': QUESTION_ANSWER_LIST[0], '2': QUESTION_ANSWER_LIST[1], '3': QUESTION_ANSWER_LIST[2]};
                    var REAL_ANSWER_INDEX;
                    var index = ['1', '2', '3'];
                    for (var i=0; i < 3;i++) {
                        if (BOUND_ANSWERS[index[i]] === QUESTION_ANSWER) {
                            REAL_ANSWER_INDEX = index[i];
                        }
                    }
                    MESSAGE.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
	                    .then(collected => {
		                    const reaction = collected.first();
                            var WIN_MSG = USER_MENTION + " Du hade rätt!";
		                    if (reaction.emoji.name === EMOJIS[parseInt(REAL_ANSWER_INDEX-1)]) {
			                    if (toString(BOUND_ANSWERS[REAL_ANSWER_INDEX]) === toString(QUESTION_ANSWER)) {
                                    MESSAGE.reply(WIN_MSG);
                                    MESSAGE.reactions.removeAll();
                                    db.AddCoinsToUser(USER_ID, QUESTION_VALUE);
                                    db.AddUserToQuizUserdata(USER_ID, QUESTION_ID);
                                    db.SetUserQuizCooldown(USER_ID);
                                    return;
                                }
		                    } else {
                                MESSAGE.reply(USER_MENTION + " Du hade fel!");
                                MESSAGE.reactions.removeAll();
                                return;
                            }
	                    })
	                    .catch(collected => {
		                    MESSAGE.reply('Du svarade inte');
	                    });
                }).catch(error => {
                    console.log('QUIZ, getUserdataQuiz: ' + error);
                });
            }).catch(error => {
                console.log('QUIZ, getUserAllQuestions: ' + error);
            });
        }).catch(error => {
            console.log("QUIZ, IsUserInDatabase E: " + error);
        });
    }).catch(error => {
        console.log("QUIZ, getUserQuizCooldown: " + error);
    });
        return;
	},
};