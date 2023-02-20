const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');

module.exports = {
    data:new SlashCommandBuilder().setName('delay').setDescription('Replies with ping(ms)!'),
    async execute(client,interaction){
        const msg = await interaction.reply({
            content: "calculating delay...",
            fetchReply: true
        });
        const ping=msg.createdTimestamp-interaction.createdTimestamp;
        await interaction.editReply(`ping(ms) is ${ping}\n API ${client.ws.ping}`)
    }
}