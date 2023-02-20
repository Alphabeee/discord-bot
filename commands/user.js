const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');

module.exports = {
    data:new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    async execute(client,interaction){
        await interaction.reply(`你的名字為: ${interaction.user.tag}\n你的id為: ${interaction.user.id}`);
    }
}