const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const db = require('../utilities/db_connect.js');
const gb = require('../utilities/global_functions.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('sjung')
		.setDescription('sjung')
        .addStringOption(option =>
			option.setName('låtar')
				.setDescription('Låt Lista!')
				.setRequired(true)
				.addChoices(
					{ name: 'Baskomp', value: 'baskomp.mp3' },
					{ name: 'Birthday', value: 'birthday.mp3' },
					{ name: 'Blomstertid', value: 'blomstertid.mp3' },
                    { name: 'Godmorgon', value: 'godmorgon.mp3' },
                    { name: 'Pling Pling', value: 'plingpling.mp3' },
                    { name: 'Pling Plong', value: 'plingplong.mp3' },
                    { name: 'Ring of Fire', value: 'ring.mp3' },
                    { name: 'Sommarvisa', value: 'sommarvisa.mp3' },
                    { name: 'Semester Melodi', value: 'semestermelodi.mp3' },
                    
				)),

	async execute(interaction) {
        const user = interaction.user;
        const user_id = user.id;
        const username = user.username;
        const user_mention = "<@" + user_id + ">";
        const path = "./mp3/";
        let song = interaction.options.getString('låtar');
        let onlySongName = song.split(".")[0];
        let filePath = path + song;
        let guildID = interaction.guild.id;

        await interaction.deferReply();

        let IsUserInDB = await db.IsUserInDatabase(user_id, guildID)
        if (IsUserInDB === false) {
            if (gb.isValidUserId(user_id) === false) {
                await interaction.editReply(user_mention + "Det där är ingen användare!")
                return;
            }
            await db.AddUserToDatabase(user_id, username, guildID);
        }
    
        const UserInventory = await db.GetUserInventory(user_id, guildID);
        let DoUserHaveSong = false;
        for(let i=0;i<UserInventory.length;i++) {
            let item = UserInventory[i].item;
            if (item === onlySongName) {
                DoUserHaveSong = true;
                break;
            }
        }

        if (DoUserHaveSong === false) {
            await interaction.editReply("Du har inte denna sång. Köp den i shopen.");
            return;
        }

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            await interaction.editReply('You need to be in a voice channel to play music!');
            return;
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            await interaction.editReply('MP3 file not found!');
            return;
        }

        const player = createAudioPlayer();

        const resource = createAudioResource(filePath, {
            inlineVolume: true
        });
        resource.volume.setVolume(0.5); 

        const subscription = connection.subscribe(player);

        if (!subscription) {
            console.error('Failed to subscribe to voice connection!');
            await interaction.editReply('Failed to play the MP3!');
            return;
        }

        player.play(resource);

        await interaction.editReply("Spelar upp ljud.");

        player.on(AudioPlayerStatus.Idle, () => {
            const connection = getVoiceConnection(interaction.guild.id);
            if (connection) {
                connection.destroy();
            }
        });


        player.on('error', error => {
            console.error('Error:', error.message);
            connection.destroy();
            interaction.editReply('An error occurred while playing audio!');
        });

	},
};