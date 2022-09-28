/*******************************************************************************
 *  cron/weeklyMeetup.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/27 05:30 PM
 *  |__   _|/ __/                          Updated: 2022/09/28 11:39 AM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import {
  Channel,
  EmbedBuilder,
  Guild,
  GuildManager,
  ChannelType,
  OverwriteType,
  PermissionFlagsBits,
} from 'discord.js'
import * as database from '../database.js'

/**
 * Split array into multiple, smaller arrays of the given `size`.
 *
 * @param {Array} array
 * @param {Number} size
 *
 * @returns {Array[]}
 */
const chunk = (array: any[], size: number): any[][] => {
  const chunks = []
  array = [].concat(...array)
  
  while (array.length) chunks.push(array.splice(0, size))
  
  return chunks
}

/**
 * Send message embed into channel.
 *
 * @param {Channel} channel
 * @param {EmbedBuilder} embed
 *
 * @returns {void}
 */
const send = async (channel: Channel, embed: EmbedBuilder): Promise<void> => {
  if (channel?.isTextBased()) channel.send({ embeds: [embed] })
}

/**
 * Delete the channels of random weekly meetups
 *
 * @param {Guild} guild
 *
 * @returns {void}
 */
export const deleteChannels = async (guild: Guild): Promise<void> => {
  const fetchedChannel = (await guild.channels.fetch()).map(r => {
    if (r.name.startsWith('rencontre-')) return r
  })
  
  fetchedChannel.map(channel => channel?.delete())
}

/**
 * Create groups channel.
 *
 * @returns {void}
 */
const generateGroup = async (groups: { id: string }[][], guild: Guild): Promise<void> => {
  await deleteChannels(guild)
  groups.map(async (group, i) => {
    const channel = await guild.channels.create({
      name: `Rencontre #${i + 1}`,
      type: ChannelType.GuildText,
      parent: '1024398776376500348',
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        ...group.map(user => ({
          id: String(user.id),
          allow: [PermissionFlagsBits.ViewChannel],
          type: OverwriteType.Member,
        })),
      ],
    })
    
    channel.send({ embeds: [
      new EmbedBuilder()
        .setTitle('Rencontre aléatoire')
        .setColor(1146986)
        .setDescription(`Bienvenue @here ! Ce salon a été créer afin que vous organisiez un meetup entre vous !`)
      ]
    })
  })
}

/**
 * Create meetup groups
 *
 * @param {GuildManager} guilds
 *
 * @returns {void}
 */
export const createMeetupGroups = async (guilds: GuildManager): Promise<void> => {
  const guild = await guilds.fetch(String(process.env.DISCORD_GUILD_ID))
  const channel = await guild.channels.fetch(String(process.env.MEETUP_CHANNEL_LOG))
  if (!channel) throw new Error('Channel not found. Please check guild & channel id')
  
  const members = (await guild.members.fetch()).filter(member => !member.user.bot)
  
  const messageEmbed = new EmbedBuilder()
    .setTitle('Kurzgesagt Bot - Weekly meetup logs')
    .setColor(1146986)
  
  members.map(async member => {
    if (member.user.bot) return
    await database.createUser(member.user)
  })
  
  const queryResult = await database.instance.all('SELECT id FROM users WHERE randomGroups = ?', true)
  // @ts-ignore
  const count = queryResult.length
  // @ts-ignore
  const participants = queryResult.sort(() => Math.random() - 0.5)
  messageEmbed.addFields({ name: 'Participants', value: String(count), inline: true })
  
  if (count < 5) {
    messageEmbed.addFields({ name: 'Résultat', value: 'Nombre de participants insuffisant' })
    await send(channel, messageEmbed)
    return
  }
  
  const groups = chunk(participants, 5)
  
  await generateGroup(groups, guild)
  
  messageEmbed.addFields({ name: 'Groupes crées', value: String(groups.length), inline: true })
  await send(channel, messageEmbed)
}
