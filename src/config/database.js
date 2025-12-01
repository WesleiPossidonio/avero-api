const dotenv = require('dotenv')
const pg = require('pg')
dotenv.config()

module.exports = {
  dialect: 'postgres',
  dialectModule: pg,
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
