import 'reflect-metadata'
import 'dotenv/config'

import { dirname, importx } from '@discordx/importer'
import type { Interaction, Message } from 'discord.js'
import { IntentsBitField } from 'discord.js'
import { Client } from 'discordx'
import * as sqlite3 from 'sqlite3'
import * as database from './database'

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildScheduledEvents,
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

// initializing db
const db = new sqlite3.Database(`./${process.env.DB_NAME}.db`,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error(err.message)
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
    
    database.create(db)
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
