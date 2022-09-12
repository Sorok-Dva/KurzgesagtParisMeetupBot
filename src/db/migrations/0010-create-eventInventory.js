module.exports = `
  CREATE TABLE IF NOT EXISTS eventInventory(
    id text not null,
    eventId text not null primary key,
    count int not null default 0
  )
`
