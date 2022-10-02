import { Pagination } from '@discordx/pagination'
import type { CommandInteraction } from 'discord.js'
import { EmbedBuilder } from 'discord.js'
import { Discord, MetadataStorage, Slash } from 'discordx'

@Discord()
export class Commands {
  @Slash({
    description: 'Liste des commandes disponibles',
    name: 'commands',
  })
  async pages(interaction: CommandInteraction): Promise<void> {
    const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
      return { description: cmd.description, name: cmd.name }
    })
    
    const pages = commands.map((cmd, i) => {
      const embed = new EmbedBuilder()
        .setFooter({ text: `Page ${i + 1} sur ${commands.length}` })
        .setTitle('**Infos de la commande**')
        .addFields({ name: 'Nom', value: cmd.name })
        .addFields({ name: 'Description', value: cmd.description })
      
      return { embeds: [embed] }
    })
    
    const pagination = new Pagination(interaction, pages)
    await pagination.send()
  }
}
