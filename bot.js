import TelegramBot from "node-telegram-bot-api"
import { v4 as uuidv4 } from "uuid"

// Start Telegram bot
const bot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN,
  {
    polling: true
  }
)

// Store API keys temporarily in memory
export const apiKeys = {}

// /start command
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(
    msg.chat.id,

`🤖 Welcome to LUVY STACK LSK

Your personal AI API gateway.

Commands:

/newkey  - Generate API key
/me      - Your account info
/keys    - View your keys
/help    - Help menu`
  )

})

// /help command
bot.onText(/\/help/, (msg) => {

  bot.sendMessage(
    msg.chat.id,

`📚 LUVY STACK LSK Help

/newkey
Generate a new API key

/me
View your Telegram account info

/keys
View generated keys

API Endpoint:

/v1/chat/completions`
  )

})

// /newkey command
bot.onText(/\/newkey/, (msg) => {

  const key = "lsk_" + uuidv4()

  // Save API key
  apiKeys[key] = {
    userId: msg.from.id,
    username: msg.from.username || "unknown",
    createdAt: new Date().toISOString()
  }

  bot.sendMessage(
    msg.chat.id,

`✅ API Key Generated

${key}

Keep this key safe.
Use it with your apps or AI clients.`
  )

})

// /me command
bot.onText(/\/me/, (msg) => {

  bot.sendMessage(
    msg.chat.id,

`👤 Account Info

ID: ${msg.from.id}

Username:
@${msg.from.username || "none"}

First Name:
${msg.from.first_name || "unknown"}`
  )

})

// /keys command
bot.onText(/\/keys/, (msg) => {

  const userKeys = Object.keys(apiKeys).filter(
    (key) => apiKeys[key].userId === msg.from.id
  )

  if (userKeys.length === 0) {

    return bot.sendMessage(
      msg.chat.id,
      "❌ No API keys found."
    )
  }

  const formattedKeys = userKeys
    .map((key) => `• ${key}`)
    .join("\n")

  bot.sendMessage(
    msg.chat.id,

`🔑 Your API Keys

${formattedKeys}`
  )

})

// Unknown commands
bot.on("message", (msg) => {

  const text = msg.text

  if (
    text &&
    text.startsWith("/") &&
    ![
      "/start",
      "/help",
      "/newkey",
      "/me",
      "/keys"
    ].includes(text)
  ) {

    bot.sendMessage(
      msg.chat.id,
      "❌ Unknown command.\nUse /help"
    )
  }

})

console.log("🤖 LUVY STACK LSK Bot Running")