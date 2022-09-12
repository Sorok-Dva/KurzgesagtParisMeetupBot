/*******************************************************************************
 *  database.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/09 10:52 PM
 *  |__   _|/ __/                          Updated: 2022/09/11 04:46 PM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import sqlite3 from 'sqlite3'
import { User } from 'discord.js'
import { dirname } from '@discordx/importer'
import * as fs from 'fs'
import * as util from 'util'

import { IUser } from './@types/user'

const instance = new sqlite3.Database(`./${process.env.DB_NAME}.db`,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error(err.message)
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
    
    create()
  })

// @ts-ignore
instance.run = util.promisify(instance.run)
// @ts-ignore
instance.get = util.promisify(instance.get)
// @ts-ignore
instance.all = util.promisify(instance.all)

const create = (): void => {
  const migrations = fs.readdirSync(dirname(import.meta.url) + '/db/migrations/')
    .filter(file => file.endsWith('.sql'))
  
  for (const file of migrations) {
    console.log('CREATE', file)
    const migration = fs.readFileSync(`${dirname(import.meta.url)}/db/migrations/${file}`).toString()
    instance.exec(migration)
  }
}

const createUser = async (user: User): Promise<void> => {
  const result = await instance.get('SELECT id FROM users WHERE id = ?', user.id)
  if (!result) {
    instance.run(`INSERT INTO users (id, nickname) VALUES ("${user.id}", "${user.username}")`)
    console.log(`${user.username} created`)
  } else {
    await instance.run('UPDATE users SET nickname = ? WHERE id = ?', [user.username, user.id])
  }
}

const getUser = async (user: User): Promise<IUser> => {
  return <IUser><unknown>instance.get('SELECT * FROM users WHERE id = ?', user.id)
}

const updateUser = async (user: Pick<IUser, 'age' | 'name' | 'id'>) => {
  await instance.run('UPDATE users SET age = ?, name = ? WHERE id = ?', [
    user.age,
    user.name,
    user.id,
  ])
}

export {
  instance,
  create,
  createUser,
  updateUser,
  getUser,
}
