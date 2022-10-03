/*******************************************************************************
 *  commands/roles.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/10/02 09:03 PM
 *  |__   _|/ __/                          Updated: 2022/10/03 09:28 PM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import type { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { EmbedBuilder, GuildMemberRoleManager, Message, Role, User } from 'discord.js'

@Discord()
export class Roles {
  @Slash({ description: 'Récupérez la liste des membres appartenant à un role' })
  async list(
    @SlashOption({ description: 'Rôle', name: 'role' })
      role: Role,
    interaction: CommandInteraction
  ): Promise<void> {
    interaction.guild?.members.fetch()
    const users = interaction.guild?.roles.cache.get(role.id)?.members.map(m => `<@${m.user.id}>`)
    const message = new EmbedBuilder()
      .setColor(1752220)
      .setTitle(`Liste des utlisateurs avec le role ${role.name}`)
      .setDescription(users?.join(', ') ?? 'Aucun')
      .addFields({ name: 'Total', value: String(users?.length), inline: true })
      .setFooter({ text: `Demandé par ${interaction.member?.user.username}` })
    
    await interaction.reply({ embeds: [message] })
  }
}
