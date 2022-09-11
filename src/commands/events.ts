/*******************************************************************************
 *  commands/events.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/09 09:34 AM
 *  |__   _|/ __/                          Updated: 2022/09/11 05:07 AM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import { Pagination } from '@discordx/pagination'
import type { CommandInteraction } from 'discord.js'
import { EmbedBuilder } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'

@Discord()
@SlashGroup({ name: 'events', description: 'Manage events' })
@SlashGroup('events')
export class Events {
  @Slash({
    description: 'Liste des events à venir',
  })
  async list(interaction: CommandInteraction): Promise<void> {
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
  
  @Slash()
  async create(
    @SlashOption({ description: 'Name of the event', name: 'name' })
      name: string,
    @SlashOption({ description: 'Description of the event', name: 'desc' })
      description: string,
    @SlashOption({ description: 'Date of the event (dd-mm-yyyy HH:mm)', name: 'date' })
      date: string,
    interaction: CommandInteraction
  ): Promise<void> {
  
  }
  
  @Slash()
  @SlashGroup('inventory')
  async add(interaction: CommandInteraction): Promise<void> {
  
  }
}
