const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const { token,botid } = require('./token.json');
const wait = require('node:timers/promises').setTimeout;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('delay').setDescription('Replies with ping(ms)!'),
    new SlashCommandBuilder().setName('dice').setDescription('dice')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(botid), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

    client.once('ready', () => {
        console.log('Ready!');
    });
    
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const { commandName } = interaction;
    
        if (commandName === 'ping') {
            await interaction.reply('Pong!');
            await wait(2000);
            await interaction.editReply('Pong again!');
        } else if (commandName === 'server') {
            await interaction.reply(`伺服器名稱: ${interaction.guild.name}\n人員總數: ${interaction.guild.memberCount}`);
        } else if (commandName === 'user') {
            await interaction.reply(`你的名字為: ${interaction.user.tag}\n你的id為: ${interaction.user.id}`);
        }
        else if(commandName === 'delay'){
            const msg = await interaction.reply({
                content: "calculating delay...",
                fetchReply: true
            });
            const ping=msg.createdTimestamp-interaction.createdTimestamp;
            await interaction.editReply(`ping(ms) is ${ping}\n API ${client.ws.ping}`)
        }
        else if(commandName === 'dice'){
            const final = Math.floor(Math.random() * (6 - 1))+1
            const diceEmbed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle(`🎲你得到了 ${final}`)
            interaction.channel.send({embeds:[diceEmbed]});
        }
    });
    
    client.login(token);