import { dev } from '$app/environment';
import { ENABLE_DRIZZLE_LOGGER, MYSQL_DB_HOST, MYSQL_DB_PORT, MYSQL_DB_USER, MYSQL_DB_NAME, MYSQL_DB_PASSWORD } from '$env/static/private';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import * as mysql from 'mysql2';
import config from './drizzle.config';

const connection = mysql.createConnection({
    host: MYSQL_DB_HOST,
    port: Number(MYSQL_DB_PORT),
    user: MYSQL_DB_USER,
    password: MYSQL_DB_PASSWORD,
    database: MYSQL_DB_NAME,
})

const drizzleClient = drizzle(connection,
{
    ...config,
    schema,
    mode: 'default',
    logger: ENABLE_DRIZZLE_LOGGER ? Boolean(ENABLE_DRIZZLE_LOGGER) : dev,
});

export { drizzleClient as legacyDb };
