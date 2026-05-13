const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let db;

async function connect() {
  if (!db) {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    db = client.db("leaderbot");
  }
  return db;
}

async function load() {
  try {
    const database = await connect();
    const doc = await database.collection("leaderboard").findOne({ _id: "main" });
    if (!doc || !Array.isArray(doc.entries)) return [];
    return doc.entries;
  } catch (err) {
    console.error("MongoDB load error:", err.message);
    return [];
  }
}

async function save(entries) {
  try {
    const database = await connect();
    await database.collection("leaderboard").updateOne(
      { _id: "main" },
      { $set: { entries } },
      { upsert: true }
    );
  } catch (err) {
    console.error("MongoDB save error:", err.message);
    throw err;
  }
}

function hasModRole(member) {
  return member.roles.cache.some(r => r.name === "Moderator");
}

module.exports = { load, save, hasModRole };
