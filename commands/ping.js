const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data:new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    async execute(client,interaction){
        await interaction.reply('Pong!');
        await wait(2000);
        await interaction.editReply('Pong again!');
    }
}
