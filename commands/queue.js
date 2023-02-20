const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder, Collection, Partials, Guild} = require('discord.js');
const { Client, GatewayIntentBits ,Discord} = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const wait = require('node:timers/promises').setTimeout;
const sqlite3 = require('sqlite3').verbose();
const dotenv = require("dotenv")
const fs = require('node:fs');
const ytdl = require('ytdl-core');
const {QueryType} = require("discord-player")
const { Player } = require("discord-player");
const { resourceUsage } = require('node:process');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue")
    ,
    async execute(client,interaction){
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.channel.send(`There is nothing playing!`)
        const q = queue.songs
        .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
        .join('\n')
        interaction.channel.send(`**Server Queue**\n${q}`)
    }
}