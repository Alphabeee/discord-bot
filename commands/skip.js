const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder, Collection, Partials, Guild} = require('discord.js');
const { Client, GatewayIntentBits ,Discord} = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const wait = require('node:timers/promises').setTimeout;
const sqlite3 = require('sqlite3').verbose();
const { DisTube } = require('distube')
const fs = require('node:fs');
const ytdl = require('ytdl-core');
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const gameData = new sqlite3.Database('gameData');

module.exports = {
    data: new SlashCommandBuilder().setName('skip').setDescription('skip the song'),

    async execute(client,interaction){
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.channel.send(`| There is nothing in the queue right now!`)
        try {
            const song = await queue.skip()
            interaction.channel.send(` | Skipped! Now playing:\n${song.name}`)
        } catch (e) {
            interaction.channel.send(`| ${e}`)
        }
    }
}