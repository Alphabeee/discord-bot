const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const wait = require('node:timers/promises').setTimeout;
const sqlite3 = require('sqlite3').verbose();
const gameData = new sqlite3.Database('gameData');

module.exports = {
    data:new SlashCommandBuilder().setName('dice').setDescription('dice'),
    async execute(client,interaction){
        const final = Math.floor(Math.random() * (6 - 1))+1
            var earning = 0;
            if(final<4)
                earning=final-4;
            else earning = final -3;
            gameData.serialize(()=>{
                gameData.run(`insert into players Select ?,500 where not exists(select * from players where pId=?)`, interaction.user.id, interaction.user.id);
                gameData.run(`UPDATE players SET money=money+${earning} where pId=${interaction.user.id}`);
                gameData.each(`select * from players where pId=${interaction.user.id}`, (err, row) => {
                    const diceEmbed = new EmbedBuilder()
                        .setColor("#5865F2")
                        .setTitle(`🎲你得到了 ${final}`)
                        .setDescription(`結果：${earning}元\n你現在有 ${row.money} 元!`);
                    interaction.reply({ embeds: [diceEmbed] });
                });
            });
    }
}