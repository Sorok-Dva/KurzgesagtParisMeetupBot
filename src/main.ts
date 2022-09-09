import 'reflect-metadata'

import { dirname, importx } from '@discordx/importer'
import type { Interaction, Message } from 'discord.js'
import { IntentsBitField } from 'discord.js'
import { Client } from 'discordx'

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
  // Debug logs are disabled in silent mode
  silent: false,
  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: '!',
  },
})

bot.once('ready', async () => {
  await bot.guilds.fetch()
  await bot.initApplicationCommands()
  
  console.log('Kurzgesagt bot successfully started')
})

bot.on('interactionCreate', (interaction: Interaction) => {
  bot.executeInteraction(interaction)
})

bot.on('messageCreate', (message: Message) => {
  bot.executeCommand(message)
})

const run = async () => {
  await importx(dirname(import.meta.url) + '/{events,commands}/**/*.{ts,js}')
  
  if (!process.env.BOT_TOKEN) throw Error('Could not find BOT_TOKEN in your environment')
  await bot.login(process.env.BOT_TOKEN)
}

run()
