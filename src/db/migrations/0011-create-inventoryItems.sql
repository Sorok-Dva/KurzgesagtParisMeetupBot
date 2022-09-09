CREATE TABLE IF NOT EXISTS inventoryItems(
  id text not null primary key,
  inventoryId text not null,
  userId text not null,
  type text CHECK(type IN ('food', 'game', 'drink', 'sport', 'other')) not null DEFAULT 'other',
  description text default null,
  FOREIGN KEY(inventoryId) REFERENCES eventInventory (id),
  FOREIGN KEY(userId) REFERENCES users (id)
)
