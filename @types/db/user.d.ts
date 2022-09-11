/*******************************************************************************
 *  @types/db/users.d.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/09 02:52 PM
 *  |__   _|/ __/                          Updated: 2022/09/11 03:05 PM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
export interface IUser {
  id: string
  nickname: string
  name: string
  age: number
  randomGroups: boolean
  meetupParticipationCount: number
  inventoryParticipationCount: number
}
