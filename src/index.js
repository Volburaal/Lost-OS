const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`Connected as ${client.user.username}`);
  client.user.setActivity('Boring Man - Online Tactical Stickman Combat', { type: ActivityType.Playing });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply(`Pong! ${Math.round(client.ws.ping)}ms`);
  }

  if (commandName === 'clear') {
    const amount = interaction.options.getInteger('amount');
    const messages = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `Deleted ${messages.size} messages`, ephemeral: true });
  }

  if (commandName === 'choose') {
    const options = interaction.options.getString('options').split(',');
    const choice = options[Math.floor(Math.random() * options.length)].trim();
    await interaction.reply(choice);
  }

  if (commandName === 'gulag') {
    const member = interaction.options.getMember('target');
    const muteRole = interaction.guild.roles.cache.get('855853806256259103');
    if (muteRole) {
      await member.roles.add(muteRole);
      await interaction.reply(`${member} was thrown off into the gulag`);
    } else {
      await interaction.reply('Mute role not found.');
    }
  }

  if (commandName === 'announce') {
    const msg = interaction.options.getString('message');
    const channel = client.channels.cache.get('923900008158339102');
    await channel.send(msg);
    await interaction.reply({ content: 'Announced.', ephemeral: true });
  }

  if (commandName === 'say') {
    const msg = interaction.options.getString('message');
    const channel = client.channels.cache.get('823488337029365762');
    await channel.send(msg);
    await interaction.reply({ content: 'Sent.', ephemeral: true });
  }
});

const activeMessages = []; // Array of { timestamp, userId }
const activeUsers = new Set();
const messagePool = [
  "get on all fours and start barking.",
  "bro wtf are you on?? ive seen crack addicts do better.",
  "straight up jorkin' it",
  "try touching some grass instead of yourself.",
  "you good, bro?",
  "gulags looking real empty, be a shame if i had to send you there."
];

const MESSAGE_WINDOW_MS = 30000;
const MESSAGE_THRESHOLD = 10;
const COOLDOWN_MS = 60000;
let lastTriggered = 0;

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const now = Date.now();

    if (message.content.length > 35) {
        await message.reply('🤓☝');
    }

    const responses = {
        'birthday': 'Happy Birthday',
        'sex': 'not happening',
        'halp': 'no halp for you',
        'vore': 'not today',
        'lost': 'LØST SUPREMACY ✊ ✊',
        'legion': 'LØST SUPREMACY ✊ ✊',
        'clan': 'LØST SUPREMACY ✊ ✊',
        '/smoke': 'https://cdn.discordapp.com/attachments/812690432734527499/1048260282931224679/smuke.gif?'
    };

    const content = message.content.toLowerCase();
        for (const [trigger, reply] of Object.entries(responses)) {
        if (content.includes(trigger)) {
            await message.channel.send(reply);
            break;
        }
    }

    activeMessages.push({ timestamp: now, userId: message.author.id });
    activeUsers.add(message.author.id);

    while (activeMessages.length && now - activeMessages[0].timestamp > MESSAGE_WINDOW_MS) {
        activeMessages.shift();
    }

    if ( activeMessages.length >= MESSAGE_THRESHOLD && now - lastTriggered > COOLDOWN_MS) {
        lastTriggered = now;

        const userIds = Array.from(activeUsers);
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];

        const user = await message.guild.members.fetch(randomUserId).catch(() => null);
        if (user) {
            message.channel.send(`${user} ${randomMessage}`);
        }

        activeMessages.length = 0;
        activeUsers.clear();
    }
});


client.on('guildMemberAdd', member => {
  const channel = client.channels.cache.get('823488337029365762');
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle('Welcome to The Løst Legion!')
    .setDescription(`${member} Joined`)
    .setColor(0x00ffcc);

  channel.send({ embeds: [embed] });
});

client.on('guildMemberRemove', member => {
  const channel = client.channels.cache.get('823488337029365762');
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle('Goodbye')
    .setDescription(`${member} Left`)
    .setColor(0x00ffcc);

  channel.send({ embeds: [embed] });
});

client.login(process.env.BOT_KEY);
