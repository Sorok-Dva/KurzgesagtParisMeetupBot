/*******************************************************************************
 *  events/common.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/09 09:34 AM
 *  |__   _|/ __/                          Updated: 2022/09/11 11:03 AM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'

@Discord()
export class Events {
  @On()
  messageDelete([message]: ArgsOf<'messageDelete'>, client: Client): void {
    console.log('Message Deleted', client.user?.username, message.content)
  }
}
