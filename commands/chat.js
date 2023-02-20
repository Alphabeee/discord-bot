const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const {OPENAI_KEY,OPENAI_ORG} = require("../token.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with The Professor')
    .addStringOption(option =>
      	option.setName('input')
        .setDescription('What are you wondering?')
        .setRequired(true)),

  async execute(client,interaction) {
    const prompt =  `Give me answer or option to ${interaction.options.getString('input')}`;
    await interaction.deferReply({ content: "Let me think..." })

    const configuration = new Configuration({
        apiKey: OPENAI_KEY,
        organization:OPENAI_ORG
    });
    const openai = new OpenAIApi(configuration);
    
    const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: prompt,
		max_tokens: 2048,
		temperature: 0.7,
		top_p: 1,
		frequency_penalty: 0.0,
		presence_penalty: 0.0,
    });
    const picture = await openai.createImage({
        
    })
    let responseMessage = '> ' + interaction.options.getString('input') + response.data.choices[0].text;

    /* If the response is longer than 2000 characters, it will be sent as a file. */
    if (responseMessage.length >= 2000) {
    	const attachment = new AttachmentBuilder(Buffer.from(responseMessage, 'utf-8'), { name: 'response.txt' });
    	await interaction.editReply({ files: [attachment] })
    } else {
    	await interaction.editReply(responseMessage);    
    }
  },
};