import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

export default {
  dialect: 'postgres',
  dialectModule: pg,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
