/*******************************************************************************
 *  commands/profile.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/11 02:02 PM
 *  |__   _|/ __/                          Updated: 2022/09/11 05:07 PM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import type { CommandInteraction } from 'discord.js'
import { EmbedBuilder, GuildMember } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { getUser, updateUser } from '../database.js'

@Discord()
@SlashGroup({ name: 'profile', description: 'Profile management' })
@SlashGroup('profile')
export class Profile {
  @Slash({
    name: 'view',
    description: 'Afficher le profil d\'un utilisateur',
  })
  async profile(
    @SlashOption({ description: 'Utilisateur', name: 'user' })
    profile: GuildMember,
    interaction: CommandInteraction
  ): Promise<void> {
    const user = await getUser(profile.user)
  
    // const guildJoinDate = Number(profile.guild.joinedTimestamp) / 1000
    const joinDate = Number(profile.joinedTimestamp) / 1000
    const profileEmbed = new EmbedBuilder()
      .setColor(1752220)
      .setAuthor({
        name: `Profil de ${profile.user.username}`,
        iconURL: profile.user.avatarURL()!,
        url: profile.user.avatarURL()!
      })
      .setThumbnail(profile.user.avatarURL())
      .setDescription('_(Complétez votre profil avec la commande `/profile edit`)_')
      .addFields({ name: 'Prénom', value: user.name ?? '??', inline: true })
      .addFields({ name: 'Âge', value: String(user.age ?? '??'), inline: true })
      .addFields({ name: '\u200B', value: '\u200B' })
      .addFields({ name: 'Meetups réalisés', value: String(user.meetupParticipationCount), inline: true })
      .addFields({ name: 'Inventaires réalisés', value: String(user.inventoryParticipationCount), inline: true })
      /*.addFields({ name: '\u200B', value: '\u200B' })
      .addFields({
        name: 'Création du compte',
        value: `<t:${~~guildJoinDate}:f> (<t:${~~guildJoinDate}:R>)`, inline: true
      })*/
      .addFields({ name: 'Date d\'arrivée', value: `<t:${~~joinDate}:f> (<t:${~~joinDate}:R>)`, inline: true })
      .setFooter({ text: `Demandé par ${interaction.member?.user.username}` })
    
    await interaction.reply({ embeds: [profileEmbed] })
  }
  
  @Slash({
    name: 'edit',
    description: 'Modifier votre profil',
  })
  async edit(
    @SlashOption({ description: 'Prénom', name: 'name' })
      name: string,
    @SlashOption({ description: 'Âge', name: 'age' })
      age: number,
    interaction: CommandInteraction
  ): Promise<void> {
    await updateUser({
      age,
      name,
      id: interaction.user.id,
    })
  
    await interaction.reply({
      content: `Profil mis à jour.`,
      ephemeral: true,
    })
  }
}
