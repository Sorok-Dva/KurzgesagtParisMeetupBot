/*******************************************************************************
 *  database.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2022/09/09 10:52 PM
 *  |__   _|/ __/                          Updated: 2022/09/11 11:03 AM
 *     |_| |_____| x Kurzgesagt Meetup Paris
 /******************************************************************************/
import sqlite3 from 'sqlite3'
import { User } from 'discord.js'
import * as fs from 'fs'
import { dirname } from '@discordx/importer'

const instance = new sqlite3.Database(`./${process.env.DB_NAME}.db`,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error(err.message)
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
    
    create()
  })

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
  await instance.get('SELECT id FROM users WHERE id = ?', user.id, (err, res) => {
    if (!res) instance.run(`INSERT INTO users (id, nickname) VALUES ("${user.id}", "${user.username}")`)
  })
}

export {
  instance,
  create,
  createUser,
}
