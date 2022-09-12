module.exports = `
  CREATE TABLE IF NOT EXISTS randomGroups(
    id text not null primary key,
    users jsonb not null,
    interest text not null,
    withSameAge boolean,
    channelId text not null,
    plannerId text not null,
    FOREIGN KEY(plannerId) REFERENCES users (id)
  )
`
