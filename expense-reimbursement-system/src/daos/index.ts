import { Pool } from 'pg'

//entrypoint for all database files
export const connectionPool:Pool = new Pool({
    host: process.env['E_HOST'],
    user: process.env['E_USER'],
    password: process.env['E_PASSWORD'],
    database: process.env['E_DATABASE'],
    port: 5432,
    max: 5
})