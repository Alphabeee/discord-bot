const { REST, SlashCommandBuilder, Routes , EmbedBuilder, messageLink,ButtonBuilder, ButtonStyle, Events , ActionRowBuilder} = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const { token,botid } = require('./token.json');
const wait = require('node:timers/promises').setTimeout;
const sqlite3 = require('sqlite3').verbose();
const gameData = new sqlite3.Database('gameData');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('delay').setDescription('Replies with ping(ms)!'),
    new SlashCommandBuilder().setName('dice').setDescription('dice'),
    new SlashCommandBuilder().setName('hi').setDescription('say hi')
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
        new SlashCommandBuilder().setName('embed').setDescription('return embed'),
        new SlashCommandBuilder().setName('janken').setDescription('janken'),
        new SlashCommandBuilder().setName('money').setDescription('how much money do you have'),
        new SlashCommandBuilder().setName('help').setDescription('help'),
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
        else if(commandName === 'hi'){
            const NAME=interaction.options.get(`person`).value;
            await interaction.reply({
                content: `hi <@${NAME}>`,
            }) ;
        }
        else if(commandName === 'embed'){
            const embed =new EmbedBuilder()
            .setTitle('This is an embed!')
            .setDescription('this is a very cool description!')
            .setColor(0x18e1ee)
            .setImage(client.user.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setAuthor({
                url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag,
            })
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag
            })
            .setURL(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
            .addFields([
                {
                    name: `Field 1`,
                    value: `Field value 1`,
                    inline: true
                },
                {
                    name: `Field 2`,
                    value: `Field value 2`,
                    inline: true
                },
            ])
            await interaction.reply({embeds: [embed]})
        }
        else if(commandName === 'janken'){
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
        else if (commandName === 'money') {
            gameData.run(`insert into players Select ?,500 where not exists(select * from players where pId=?)`, interaction.user.id, interaction.user.id);
            gameData.each(`select * from players where pId=${interaction.user.id}`, (err, row) => {
                const RPCEmbed = new EmbedBuilder()
                    .setColor("#5865F2")
                    .setTitle(`你現在有 ${row.money} 元!`);
                interaction.reply({ embeds: [RPCEmbed], components: [] });
            });
        }
        else if (commandName === 'help'){
            const embed=new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle('Show helps for bot_bot\'s slash commands')
            for(const i of commands){
                let str='';
                str+='\\';
                str+=i.name;
                embed.addFields([
                    {
                        name:'`'+str+'`',
                        value:`${i.description}`,
                        inline:false
                    }
                ])
            }
            interaction.reply({embeds:[embed]});
        }
    });
    
    client.login(token);
