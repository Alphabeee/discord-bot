const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const wait = require('node:timers/promises').setTimeout;
const sqlite3 = require('sqlite3').verbose();
const gameData = new sqlite3.Database('gameData');
module.exports = {
    data:new SlashCommandBuilder().setName('janken').setDescription('janken'),
    async execute(client,interaction){
        const RPCEmbed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle(`來猜拳！`);
            const sbutton = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('✌️')
            .setStyle(ButtonStyle.Primary);
            const RPCRow = new ActionRowBuilder()
            .addComponents(
                sbutton,
                new ButtonBuilder()
                    .setCustomId('rock')
                    .setLabel('✊')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('paper')
                    .setLabel('🖐️')
                    .setStyle(ButtonStyle.Primary)
            );
            interaction.reply({ embeds: [RPCEmbed], components: [RPCRow] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

            collector.on('collect', async i => {
                if (collector.collected.last().user.id != interaction.user.id) {
                    const noUEmbed = new EmbedBuilder()
                        .setColor("#5865F2")
                        .setTitle(`你想幹嘛？`);
                    await i.reply({ embeds: [noUEmbed], ephemeral: true });
                    return;
                }
                if (collector.collected.first().customId === 'scissors' || collector.collected.first().customId === 'rock' || collector.collected.first().customId === 'paper' && collector.collected.first().user.id == interaction.user.id) {
                    var botChoice = Math.floor(Math.random() * 3);
                    var playerChoice, gameState = 0;
                    if (collector.collected.first().customId === 'scissors') {
                        playerChoice = 0;
                    } else if (collector.collected.first().customId === 'rock') {
                        playerChoice = 1;
                    } else if (collector.collected.first().customId === 'paper') {
                        playerChoice = 2;
                    }
                    if (botChoice == 0) {
                        botChoice = '✌️';
                        if (playerChoice == 1) {
                            gameState = 2;
                        } else if (playerChoice == 2) {
                            gameState = 1;
                        }
                    } else if (botChoice == 1) {
                        botChoice = '✊';
                        if (playerChoice == 0) {
                            gameState = 1;
                        } else if (playerChoice == 2) {
                            gameState = 2;
                        }
                    } else if (botChoice == 2) {
                        botChoice = '🖐️';
                        if (playerChoice == 0) {
                            gameState = 2;
                        } else if (playerChoice == 1) {
                            gameState = 1;
                        }
                    }
                    if (playerChoice == 0) {
                        playerChoice = '✌️';
                    } else if (playerChoice == 1) {
                        playerChoice = '✊';
                    } else if (playerChoice == 2) {
                        playerChoice = '🖐️';
                    }
                    var earnings = 0, msg = '🤖' + botChoice + ' vs ' + playerChoice + '\n';
                    if (gameState == 1) {
                        earnings = -10;
                        msg += '你輸了 QQ';
                    } else if (gameState == 2) {
                        earnings = 10;
                        msg += '你贏了!';
                    } else {
                        msg += '平手';
                    }
                    gameData.serialize(() => {
                        gameData.run(`insert into players Select ?,500 where not exists(select * from players where pId=?)`, interaction.user.id, interaction.user.id);
                        gameData.run(`UPDATE players SET money=money+${earnings} where pId=${interaction.user.id}`);
                        gameData.each(`select * from players where pId=${interaction.user.id}`, (err, row) => {
                            const RPCEmbed = new EmbedBuilder()
                                .setColor("#5865F2")
                                .setTitle(msg)
                                .setDescription(`結果：${earnings}元\n你現在有 ${row.money} 元!`);
                            i.update({ embeds: [RPCEmbed], components: [] });
                        });
                    });
                }
                collector.stop();
            });
    }
}