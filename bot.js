import TelegramBot from "node-telegram-bot-api"
import { v4 as uuidv4 } from "uuid"

// Create Telegram bot
const bot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN,
  {
    polling: true
  }
)

// Store API keys in memory
export const apiKeys = {}

// Start command
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
    `🤖 Welcome to Luvy AI

Use:
/newkey  - Generate API key
/me      - View your info`
  )

})

// Generate API key
bot.onText(/\/newkey/, (msg) => {

  const key = "sk_luvy_" + uuidv4()

  // Save key
  apiKeys[key] = {
    userId: msg.from.id,
    username: msg.from.username || "unknown",
    createdAt: new Date()
  }

  bot.sendMessage(
    msg.chat.id,
    `✅ Your API Key:

${key}

Keep it safe.`
  )

})

// Show user info
bot.onText(/\/me/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
    `👤 Your Info

ID: ${msg.from.id}
Username: @${msg.from.username || "none"}`
  )

})

console.log("Telegram bot running 🚀")