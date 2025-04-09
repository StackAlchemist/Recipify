import dotenv from 'dotenv'
import {Knex} from 'knex'

dotenv.config()

const config: {[key: string]: Knex.Config} = {
    development:{
        client: 'pg',
        connection:{
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        }
    }
}

// console.log('PG ENV VARS:', {
//     host: process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT,
//     user: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD ? '[HIDDEN]' : 'undefined',
//     database: process.env.DATABASE_NAME
//   });
  

export default config