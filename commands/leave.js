const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder, Collection, Partials, Guild} = require('discord.js');
const { Client, GatewayIntentBits ,Discord} = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const { Distube } = require('distube')

module.exports = {
    data:new SlashCommandBuilder().setName('leave').setDescription('leave channel'),
    async execute(client,interaction){
        client.distube.voices.leave(interaction)
    }
}