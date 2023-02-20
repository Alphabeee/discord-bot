const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');

module.exports = {
    data:new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    async execute(client,interaction){
        await interaction.reply(`伺服器名稱: ${interaction.guild.name}\n人員總數: ${interaction.guild.memberCount}`);
    }
}