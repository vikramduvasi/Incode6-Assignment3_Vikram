const pgp = require('pg-promise')()

const cn = 'postgres://vikramduvasi:1234@localhost:5432/mr_coffee'

const db = pgn(cn)

module.exports = db