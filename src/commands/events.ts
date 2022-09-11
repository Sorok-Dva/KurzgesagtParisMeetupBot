/*******************************************************************************
 *  commands/events.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/09 09:34 AM
 *  |__   _|/ __/                          Updated: 2022/09/11 11:03 AM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import { Pagination } from '@discordx/pagination'
import type { CommandInteraction } from 'discord.js'
import { EmbedBuilder } from 'discord.js'
import { Discord, Slash, SlashGroup } from 'discordx'

@Discord()
@SlashGroup({ name: 'events' })
@SlashGroup({ name: 'list' })
export class Events {
  @Slash({
    description: 'Liste des events à venir',
    name: 'list',
  })
  @SlashGroup('events')
  async pages(interaction: CommandInteraction): Promise<void> {
    const events = (await interaction.guild?.scheduledEvents.fetch())?.map((event) => {
      return {
        name: event.name,
        description: event.description,
        location: event.entityMetadata?.location,
        date: event.scheduledStartTimestamp,
        userCount: event.userCount,
      }
    })
    
    const pages = events?.map((event, i) => {
      const now = new Date().getTime()
      if (now >= Number(event.date)) return {}
      const time = Number(event.date) / 1000
      return new EmbedBuilder()
        .setColor(5763719)
        .setTitle('**Liste des événements disponibles**')
        .addFields({ name: 'Quand', value: `<t:${~~time}:f> (<t:${~~time}:R>)`, inline: true })
        .addFields({ name: 'Où', value: String(event.location), inline: true })
        .addFields({ name: 'Description', value: String(event.description) })
        .addFields({ name: 'Participants', value: String(event.userCount), inline: true })
        .setFooter({ text: `Event ${i + 1}/${events.length}` })
    })

    const pagination = new Pagination(interaction, pages ?? [])
    await pagination.send()
  }
  
  @Slash({
    description: 'Définir l\'inventaire d\'un event',
    name: 'set-inventory',
  })
  @SlashGroup('set-inventory', 'events')
  async setInventory(interaction: CommandInteraction): Promise<void> {
  
  }
}
