/*******************************************************************************
 *  commands/prune.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/11 11:03 AM
 *  |__   _|/ __/                          Updated: 2022/09/11 11:57 AM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import type { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { GuildMemberRoleManager, Message, Role, User } from 'discord.js'

@Discord()
export class Prune {
  @Slash({ description: 'Bulk delete messages' })
  async prune(
    @SlashOption({ description: 'Number of message to delete (100 max)', name: 'count' })
      count: number,
    @SlashOption({ description: 'Message of the user to delete', name: 'target', required: false })
      target: User,
    interaction: CommandInteraction
  ): Promise<void> {
    if (interaction.channel?.type !== 0) return
    if (!(<GuildMemberRoleManager>interaction.member?.roles).cache.some((r: Role) => r.name === 'Modération/Staff'))
      return
  
    const messagesToDelete = await interaction.channel?.messages.fetch({ limit: 100 })
  
    if (target) {
      let i = 0
      const filteredTargetMessages: Message[] = [];
      (messagesToDelete)?.filter((msg: Message): boolean => {
        if (msg.author.id == target.id && count > i) {
          filteredTargetMessages.push(msg)
          i++
        }
        return true
      })
    
      interaction.channel
        ?.bulkDelete(filteredTargetMessages, true)
        .then(() => {
          interaction.reply({
            content: `${count} messages de ${target} supprimés.`,
            ephemeral: true,
          })
        })
    } else {
      interaction.channel
        ?.bulkDelete(count, true)
        .then(() => {
          interaction.reply({
            content: `${count} messages supprimés.`,
            ephemeral: true,
          })
        })
    }
  }
}
