/*******************************************************************************
 *  main.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/09 09:34 PM
 *  |__   _|/ __/                          Updated: 2022/09/27 05:32 PM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import 'reflect-metadata'
import 'dotenv/config'

import { dirname, importx } from '@discordx/importer'
import type { Interaction, Message } from 'discord.js'
import { IntentsBitField } from 'discord.js'
import { Client } from 'discordx'
import { CronJob } from 'cron'

import * as database from './database.js'
import { createMeetupGroups } from './cron/weeklyMeetup.js'

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

bot.once('ready', async () => {
  await bot.guilds.fetch()
  await bot.initApplicationCommands()
  
  console.log('Kurzgesagt bot successfully started')
})

bot.on('interactionCreate', (interaction: Interaction) => {
  bot.executeInteraction(interaction)
})

bot.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return
  await bot.executeCommand(message)
  await database.createUser(message.author)
})

const run = async () => {
  await importx(dirname(import.meta.url) + '/{events,commands}/**/*.{ts,js}')
  
  if (!process.env.BOT_TOKEN) throw Error('Could not find BOT_TOKEN in your environment')
  await bot.login(process.env.BOT_TOKEN)
}

(async (): Promise<void> => {
  try {
    await run()
    new CronJob(String(process.env.WEEKLY_MEETUP_CRONJOB), async () => {
      await createMeetupGroups(bot.guilds)
    }).start()
  } catch (e) {
    console.log('Error while starting Kurzgesagt Meetup Bot', e)
  }
})()
