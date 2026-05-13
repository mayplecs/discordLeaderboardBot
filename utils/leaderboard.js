const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "leaderboard.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function hasModRole(member) {
  return member.roles.cache.some(r => r.name === "Moderator");
}

module.exports = { load, save, hasModRole };
