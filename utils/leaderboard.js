const https = require("https");

const BIN_ID = process.env.JSONBIN_ID;
const API_KEY = process.env.JSONBIN_KEY;
const BASE_URL = "api.jsonbin.io";

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path,
      method,
      headers: {
        "X-Master-Key": API_KEY,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Failed to parse response"));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function load() {
  try {
    const res = await request("GET", `/v3/b/${BIN_ID}/latest`);
    const entries = res.record?.entries;
    return Array.isArray(entries) ? entries : [];
  } catch (err) {
    console.error("JSONBin load error:", err.message);
    return [];
  }
}

async function save(entries) {
  try {
    await request("PUT", `/v3/b/${BIN_ID}`, { entries });
  } catch (err) {
    console.error("JSONBin save error:", err.message);
    throw err;
  }
}

function hasModRole(member) {
  return member.roles.cache.some(r => r.name === "Moderator");
}

module.exports = { load, save, hasModRole };
