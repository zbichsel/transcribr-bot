// configure the dotenv to safeguard credentials
require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const OpenAI = require('openai');

// create new instance of client for discord bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! 🚀`)
})

client.on("messageCreate", async function (message) {
    if (message.content && message.content.trim() == "/who are you voting for?") {
        return message.reply("Biden 2024 baby!!!");
    }
    // check if message from user *mentions* the bot
    const botMention = message.mentions.users.has(client.user.id);
    if (!botMention || message.author.bot || (message.guild && message.channel.name !== "〘_general_〙👱🏼👩🏽")) {
        return;
    }
    const prompt = `Act as a sage oracle zombie cat who can speak like a human and responds succinctly. Try to roleplay as much as possible using emotes when appropriate`
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": prompt },
                { "role": "user", "content": message.content }
            ],
            max_tokens: 400,
        });

        console.log(response);
        const content = response.choices[0].message;
        return message.reply(content);

    } catch (err) {
        if (err instanceof OpenAI.APIError) {
            console.error(err.status); // e.g. 401
            console.error(err.message) // e.g. The authentication token you passed was invalid...'
            console.error(err.code) // e.g. 'invalid_api_key
            console.error(err.type) // e.g. 'invalid_request_err'
        } else {
            console.log(err);
        }
        return message.reply(
            "As an AI assistant, I errored out: " + err.message
        );
    }
});

client.login(process.env.CLIENT_TOKEN);