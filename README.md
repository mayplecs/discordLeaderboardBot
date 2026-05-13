# Leaderboard Bot

A Discord bot for managing a leaderboard with slash commands. Only users with the **Moderator** role can manage it.

## Commands

| Command | Description | Permission |
|---|---|---|
| `/leaderboard` | View the leaderboard | Everyone |
| `/add <user>` | Add a user to the leaderboard | Moderator |
| `/move <user> <position>` | Move a user to a specific rank | Moderator |
| `/remove <user>` | Remove a user from the leaderboard | Moderator |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```
TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
```

- **TOKEN**: Found in Discord Developer Portal → Your App → Bot → Token
- **CLIENT_ID**: Found in Discord Developer Portal → Your App → General Information → Application ID

### 3. Register slash commands (run once)
```bash
npm run deploy
```

### 4. Start the bot
```bash
npm start
```

## Deploying to Railway

1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) and create a new project from your repo
3. Add `TOKEN` and `CLIENT_ID` as environment variables in Railway's dashboard
4. Railway will automatically run `npm start`

## File Structure

```
leaderboard-bot/
├── index.js              # Main bot entry point
├── deploy-commands.js    # Registers slash commands with Discord
├── leaderboard.json      # Auto-created, stores leaderboard data
├── package.json
├── .env                  # Your secrets (never commit this!)
├── commands/
│   ├── leaderboard.js    # /leaderboard command
│   ├── add.js            # /add command
│   ├── move.js           # /move command
│   └── remove.js         # /remove command
└── utils/
    └── leaderboard.js    # Shared read/write/permission helpers
```
