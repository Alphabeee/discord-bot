const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('shuffle').setDescription('shuffle the song queue'),

    async execute(client,interaction){
        const queue = client.distube.getQueue(interaction)

        if(!queue)return interaction.reply(`❌ | There is nothing in the queue right now!`)
        queue.shuffle()
        interaction.reply('Shuffled songs in the queue')
    }
}