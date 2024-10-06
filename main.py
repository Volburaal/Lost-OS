import random
import discord
from discord.ext import commands
from keep_alive import keep_alive

intents = discord.Intents.all()
client = commands.Bot( #ping to deliver commands, slash commands not supported yet
    command_prefix='<@990958680914661406> ',
    intents=intents,
    activity=discord.Game('Boring Man - Online Tactical Stickman Combat'))

@client.listen()
async def on_ready():
    print(f'Connected to Discord as {client.user.name}', f'Bot ID: {client.user.id}', sep='\n')
@client.command(help="Check the bot's latency")
async def ping(ctx):
    await ctx.send(f'Pong! {round(client.latency * 1000)}ms')


@client.command(help="Clear/Purge a given number of messages")
@commands.has_permissions(manage_messages=True)
async def clear(ctx, a: int):
    await ctx.channel.purge(limit=1 + a)


@client.command(help="Chooses between two options")
async def choose(ctx, a: str, b: str):
    await ctx.send(random.choice([a, b]))


@client.command(help="Sends the target to the Gulag (sweet gulag)")
async def gulag(ctx, member: discord.Member):
    if ctx.message.author.guild_permissions.manage_roles:
        mute_role = discord.utils.get(ctx.guild.roles, id=855853806256259103)
        await member.add_roles(mute_role)
        await ctx.send(f'{member.mention} was thrown off into the gulag')
    else:
        await ctx.send('Imagine having no permissions, pleb')


@client.command(help="Admin Only, sends an announcement")
async def announce(ctx, *args):
    if ctx.message.author.guild_permissions.administrator:
        channel = client.get_channel(923900008158339102)
        response = " ".join(args)
        await channel.send(response)

@client.command(help="Admin Only, says something")
async def say(ctx, *args):
    if ctx.message.author.guild_permissions.administrator:
        channel = client.get_channel(823488337029365762)
        response = " ".join(args)
        await channel.send(response)
        await ctx.message.purge(1)
        


@client.listen()
async def on_member_join(member):

    channel = client.get_channel(823488337029365762)
    embed = discord.Embed(title="Welcome to The Løst Legion!",
                          description=f"{member.mention} Joined",
                          color=0x00ffcc)
    await channel.send(embed=embed)


@client.listen()
async def on_member_remove(member):

    channel = client.get_channel(823488337029365762)
    embed = discord.Embed(title="Goodbye",
                          description=f"{member.mention} Left",
                          color=0x00ffcc)

    await channel.send(embed=embed)


@client.listen()
async def on_message(message):
    content = message.content.lower()
    responses = {
        'sex': 'not happening',
        'Løst': 'Løst Supremacy ',
        'halp': 'no halp for you',
        'vore': 'not today',
        'lost': 'LØST SUPREMACY ✊ ✊',
        'legion': 'LØST SUPREMACY ✊ ✊',
        #'lost' : 'LOST SUPREMACY ✊ ✊',
        'testavo': '.',
        '/smoke': 'https://cdn.discordapp.com/attachments/812690432734527499/1048260282931224679/smuke.gif?'
    }

    for trigger, response in responses.items():
        if trigger in content:
            await message.channel.send(response)
keep_alive()
client.run('BOT API GOES HERE')
