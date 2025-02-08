import { dev } from '$app/environment';
import {
	ENABLE_DRIZZLE_LOGGER,
	POSTGRES_DB_HOST,
	POSTGRES_DB_NAME,
	POSTGRES_DB_PASSWORD,
	POSTGRES_DB_PORT,
	POSTGRES_DB_USER,
	POSTGRES_MAX_CONNECTIONS
} from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import config from './drizzle.config';

const connection = postgres({
	host: POSTGRES_DB_HOST,
	port: Number(POSTGRES_DB_PORT),
	user: POSTGRES_DB_USER,
	password: POSTGRES_DB_PASSWORD,
	database: POSTGRES_DB_NAME,
	max: POSTGRES_MAX_CONNECTIONS ? Number(POSTGRES_MAX_CONNECTIONS) : 10,
});

export const db = drizzle(connection, {
	...config,
	schema,
	logger: ENABLE_DRIZZLE_LOGGER ? Boolean(ENABLE_DRIZZLE_LOGGER) : dev,
});

export { connection };
