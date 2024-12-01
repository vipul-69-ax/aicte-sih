const { PrismaClient } = require("@prisma/client")
const { Pool } = require("pg")

const db = new Pool({
    user: "postgres",
    password: "vipu2004",
    database: "sih",
    host: "localhost",
    port: 5432
})
const prisma = new PrismaClient();
module.exports = { db, prisma }