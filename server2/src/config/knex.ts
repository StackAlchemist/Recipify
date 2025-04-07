import dotenv from 'dotenv'
import {Knex} from 'knex'

dotenv.config()

const config: {[key: string]: Knex.Config} = {
    development:{
        client: 'pg',
        connection:{
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE_NAME,
        }
    }
}

export default config