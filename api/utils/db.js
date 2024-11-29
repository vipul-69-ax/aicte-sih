const { Pool } = require("pg")

const db = new Pool({
    user: "postgres",
    password: "vipu2004",
    database: "sih",
    host: "localhost",
    port: 5432
})

module.exports = db