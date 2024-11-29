const { InstitueAuth } = require("./auth")
const { InstitueData } = require("./data")

const InstitueRouter = require("express").Router()

InstitueRouter.use("/auth", InstitueAuth)
InstitueRouter.use("/data", InstitueData)

module.exports = InstitueRouter