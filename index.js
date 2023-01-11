const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { token,botid } = require('./token.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
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
        } else if (commandName === 'server') {
            await interaction.reply(`伺服器名稱: ${interaction.guild.name}\n人員總數: ${interaction.guild.memberCount}`);
        } else if (commandName === 'user') {
            await interaction.reply(`你的名字為: ${interaction.user.tag}\n你的id為: ${interaction.user.id}`);
        }
    });
    
    client.login(token);