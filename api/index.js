const express = require("express")
const cors = require("cors")
const { createProxyMiddleware } = require('http-proxy-middleware')
const InstitueRouter = require("./routes/institute")
const { sendOtpEmail } = require("./controllers/otp")
const { actionLogger } = require("./services/logging")
const prisma = require("./utils/db")

const app = express()

app.use(cors())
app.use(express.json())

// Existing routes
app.use("/institute", InstitueRouter)
app.post("/otp", sendOtpEmail)
app.get("/", (req, res) => { res.send("hiii") })
// Proxy middleware for FastAPI chat service
app.use('/api/chat', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/chat': '/chat', // rewrite path
  },
}))

async function cleanup() {
  await actionLogger.pushToDB().then(() => { console.log("Logged Pushed to the DB.") });
  await prisma.$disconnect().then(() => { console.log("Closed Database Connection.") });
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})

module.exports = app