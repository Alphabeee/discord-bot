const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');

module.exports = {
    data:new SlashCommandBuilder().setName('hi').setDescription('say hi')
        .addStringOption((option)=>option
        .setName('person')
        .setDescription('select one person you want to say hi')
        .setRequired(true)
        .addChoices(
            {
                name: 'ATREE',
                value: '345922184017084427',
            },
            {
                name: 'MOMO',
                value: '707875745225244752',
            },
            {
                name: 'SHAMAN',
                value: '550337187770531840',
            },
            {
                name: 'BOSS',
                value: '674752443711750144',
            },
            {
                name: 'UNCLE',
                value: '183527806402035712',
            },
            {
                name: 'QUESTION',
                value: '797670367681576961',
            },
            {
                name: 'THECAR',
                value: '381738004630208522',
            },
            {
                name: 'SHEEP',
                value: '469059236434018306',
            },
            {
                name: 'robot',
                value: '1063682067478630410',
            },
        )),
    async execute(client,interaction){
        const NAME=interaction.options.get(`person`).value;
        await interaction.reply({
            content: `hi <@${NAME}>`,
        });
    }
}