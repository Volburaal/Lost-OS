const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),
  new SlashCommandBuilder().setName('clear').setDescription('Delete messages')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number to delete').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder().setName('choose').setDescription('Choose between options')
    .addStringOption(opt => opt.setName('options').setDescription('Separate choices with commas').setRequired(true)),

  new SlashCommandBuilder().setName('gulag').setDescription('Send someone to the gulag')
    .addUserOption(opt => opt.setName('target').setDescription('unfortunate soul').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  new SlashCommandBuilder().setName('announce').setDescription('Admin: Send an announcement')
    .addStringOption(opt => opt.setName('message').setDescription('Announcement content').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder().setName('say').setDescription('Admin: Bot sends a message')
    .addStringOption(opt => opt.setName('message').setDescription('Message to say').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
]
  .map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_KEY);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Slash commands registered!');
  } catch (err) {
    console.error(err);
  }
})();
