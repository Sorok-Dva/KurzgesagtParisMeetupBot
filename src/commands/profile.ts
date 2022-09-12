/*******************************************************************************
 *  commands/profile.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/11 02:02 PM
 *  |__   _|/ __/                          Updated: 2022/09/12 11:04 AM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import type { CommandInteraction } from 'discord.js'
import { EmbedBuilder, GuildMember } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { getUser, updateUser } from '../database.js'

const hobbiesRoles = [
  1017135361668943882,
  1017141926316757022,
  1017141932478173394,
  1017141934789242963,
  1017141937934975037,
  1017141939985977384,
  1017395758758105108,
  1017395776671981608,
  1017416136922513419,
  1017416121344868415,
  1017689659536576513,
  1017554858217308222,
  1017143256959688794,
  1017376729863569498,
]

const gamesRoles = [
  1017547136352665601, // LoL
  1017547312790257734, // Dota 2
  1017547315587854366, // Autres Moba
  1017547318066679848, // Minecraft
  1017547320667148428, // WoW
  1017547322898518057, // Dofus
  1017547324865654915, // Autres MMO
  1017547326920863826, // Among us
  1017547328929931344, // Hearthstone
  1017547330985136148, // CS:GO
  1017547333031968768, // Valorant
  1017547334931988550, // Battle royales
  1017547336878133289, // Destiny 2
  1017547339075952710, // Rocket League
  1017548562810281994, // PoE
  1017548566518046802, // Lost Ark
  1017548569529569403, // Autres ARPG
  1017548572914368562, // Stardew Valley
  1017548575678402580, // Sea of thieves
  1017548578870263859, // Star Citizen
  1017554866522038272, // Outer Wilds
  1017690445964390421, // Monster Hunter
]

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
    const roles = profile.roles.cache.map(r => r.name).join('\n')
    const gender = roles.includes('Homme') ? '🚹 Homme'
      : roles.includes('Femme') ? '🚺 Femme'
        : roles.includes('Non binaire') ? '🚻 Non binaire' : '❓'
    const pronoun = roles.includes('Il') ? '(Il/lui)'
      : roles.includes('Elle') ? '(Elle/elle)'
        : roles.includes('Iel') ? '(Iel/iel)' : ''
    const dm = roles.includes('DM ouvert') ? 'Ouvert'
      : roles.includes('DM fermé') ? 'Fermé'
        : roles.includes('DM sur demande') ? 'Sur demande' : '❓'
    const hobbies = profile.roles.cache.map(r => {
      if (hobbiesRoles.includes(Number(r.id))) return r.name
      return false
    }).filter(Boolean).join('\n')
    const games = profile.roles.cache.map(r => {
      if (gamesRoles.includes(Number(r.id))) return r.name
      return false
    }).filter(Boolean).join('\n')
    
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
      .addFields({ name: 'Genre', value: `${gender} ${pronoun}`, inline: true })
      .addFields({ name: 'Prénom', value: user?.name ?? '❓', inline: true })
      .addFields({ name: 'Âge', value: String(user?.age ?? '❓'), inline: true })
      .addFields({ name: 'Message privé', value: dm, inline: true })
      .addFields({ name: 'Centres d\'interêt', value: hobbies ?? 'Aucun', inline: true })
      .addFields({ name: 'Jeux', value: games ?? 'Aucun', inline: true })
      .addFields({ name: '\u200B', value: '\u200B' })
      .addFields({ name: 'Meetups réalisés', value: String(user?.meetupParticipationCount ?? 0), inline: true })
      .addFields({ name: 'Inventaires réalisés', value: String(user?.inventoryParticipationCount ?? 0), inline: true })
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
