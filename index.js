const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder, Collection, Partials, Guild} = require('discord.js');
const { Client, GatewayIntentBits ,Discord} = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const { DisTube } = require('distube')
const fs = require('fs');
const {Configuration ,OpenAIApi} = require("openai");
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const dotenv = require('dotenv')
dotenv.config()
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,   
        GatewayIntentBits.MessageContent     
    ],
});
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ]
})
client.commands = new Collection()
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command =require(`./commands/${file}`);
    client.commands.set( command.data.name, command)
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.BOTID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

    
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if(!command)return;
    
    try{
        command.execute(client,interaction)
    }catch(error){
        console.error(error);
    }
})

client.once('ready', () => {
    console.log('Ready!');
});
const embed = new EmbedBuilder();
const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
.on('playSong', (queue, song) =>{
	embed.setDescription(`▶️ | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
	song.user
	}\n${status(queue)}`).setThumbnail(song.thumbnail),
	queue.textChannel.send({embeds:[embed]})
})
.on('addSong', (queue, song) =>{
	embed.setDescription(`☑️ | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`),
	queue.textChannel.send({embeds:[embed]})
})
.on('addList', (queue, playlist) =>{
	embed.setDescription(`☑️ | Added \`${playlist.name}\` playlist (${
		playlist.songs.length
	} songs) to queue\n${status(queue)}`),
	queue.textChannel.send({embeds:[embed]})
})
.on('error', (channel, e) => {
	if (channel) channel.send(`❌ | An error encountered: ${e.toString().slice(0, 1974)}`)
	else console.error(e)
})
.on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
.on('searchNoResult', (message, query) =>
	message.channel.send(`❌ | No result found for \`${query}\`!`)
)
.on('finish', queue => queue.textChannel.send('Finished!'))
client.login(process.env.TOKEN);
