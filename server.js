import express from "express"
import axios from "axios"

import "./bot.js"
import { apiKeys } from "./bot.js"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("AI Gateway Running 🚀")
})

app.post("/v1/chat/completions", async (req, res) => {

  try {

    // Get API key from headers
    const auth = req.headers.authorization

    if (!auth) {
      return res.status(401).json({
        error: "Missing API key"
      })
    }

    // Remove "Bearer "
    const key = auth.replace("Bearer ", "")

    // Validate key
    if (!apiKeys[key]) {
      return res.status(403).json({
        error: "Invalid API key"
      })
    }

    // Send request to xAI
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: req.body.model || "grok-beta",
        messages: req.body.messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    // Return xAI response
    res.json(response.data)

  } catch (err) {

    console.log(err.response?.data || err.message)

    res.status(500).json({
      error: "Server Error"
    })
  }
})

// Railway uses PORT automatically
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})