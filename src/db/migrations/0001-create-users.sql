CREATE TABLE IF NOT EXISTS users(
  id text not null primary key,
  nickname text not null,
  name text default null,
  age text default null,
  randomGroups boolean default false,
  meetupParticipationCount int not null default 0,
  inventoryParticipationCount int not null default 0
)
