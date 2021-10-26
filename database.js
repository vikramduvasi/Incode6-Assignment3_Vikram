const pgp = require('pg-promise')()

const cn = 'postgres://postgres:1234@localhost:5432/mr_coffee'

const db = pgp(cn)

module.exports = db