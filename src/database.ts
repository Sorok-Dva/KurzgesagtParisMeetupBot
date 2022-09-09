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
    const migration = fs.readFileSync(`${dirname(import.meta.url)}/db/migrations/${file}`).toString()
    instance.exec(migration)
  }
}

const createUser = async (user: User): Promise<void> => {
  const all = await instance.exec('SELECT * FROM users')
  const row = await instance.get('SELECT id FROM users WHERE id = ?', user.id)
  console.log('row', row, all)
  instance.run(`INSERT INTO users (id, nickname) VALUES ("${user.id}", "${user.username}")`)
}

export {
  instance,
  create,
  createUser,
}
