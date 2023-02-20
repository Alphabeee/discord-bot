const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder, Collection, Partials, Guild} = require('discord.js');
const { Client, GatewayIntentBits ,Discord} = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const { Distube } = require('distube')


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("load songs from youtube ,spotify,and songcloud")
        .addStringOption(option =>
            option.setName('song')
            .setDescription('Please enter a song url or query to search.')
            .setRequired(true)
        ),        
    async execute(client,interaction){
        if(!interaction.member.voice.channel)
            return interaction.reply("You need to in a voice channel");
        const str = interaction.options.getString("song");
        client.distube.play(interaction.member.voice.channel,str,{
            member:interaction.member,
            textChannel:interaction.channel,
            interaction
        })
    }
}