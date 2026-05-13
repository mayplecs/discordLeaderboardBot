const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db("leaderbot");
  }
  return db;
}

async function load() {
  const database = await connect();
  const doc = await database.collection("leaderboard").findOne({ _id: "main" });
  return doc ? doc.entries : [];
}

async function save(entries) {
  const database = await connect();
  await database.collection("leaderboard").updateOne(
    { _id: "main" },
    { $set: { entries } },
    { upsert: true }
  );
}

function hasModRole(member) {
  return member.roles.cache.some(r => r.name === "Moderator");
}

module.exports = { load, save, hasModRole };
