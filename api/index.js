const express = require("express")
const cors = require("cors")
const InstitueRouter = require("./routes/institute")
const { sendOtpEmail } = require("./controllers/otp")
const { actionLogger } = require("./services/logging")
const prisma = require("./utils/db")
const { evaluatorRouter } = require("./routes/evaluator")

const app = express()

app.use(cors())
app.use(express.json())

// Existing routes
app.use("/institute", InstitueRouter);
app.use("/evaluator", evaluatorRouter);
app.post("/otp", sendOtpEmail);
app.get("/", (req, res) => { res.send("hiii") });

async function cleanup() {
  await actionLogger.pushToDB().then(() => { console.log("Logged Pushed to the DB.") });
  await prisma.$disconnect().then(() => { console.log("Closed Database Connection.") });
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
const PORT = process.env.PORT || 3100
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})

module.exports = app