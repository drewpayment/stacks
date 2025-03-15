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
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import config from './drizzle.config';

// Check if we're in build mode
const isBuild = process.env.NODE_ENV === 'production' && process.env.BUILD_MODE === 'true';
let client: postgres.Sql<Record<string, any>>;
let db: PostgresJsDatabase<typeof schema> & {
	$client: postgres.Sql<Record<string, any>>;
}

if (isBuild) {
	db = {} as any;
	console.log('Using mock database for build');
} else {
	client = postgres({
		host: POSTGRES_DB_HOST,
		port: Number(POSTGRES_DB_PORT),
		user: POSTGRES_DB_USER,
		password: POSTGRES_DB_PASSWORD,
		database: POSTGRES_DB_NAME,
		max: POSTGRES_MAX_CONNECTIONS ? Number(POSTGRES_MAX_CONNECTIONS) : 10,
		prepare: false,
	});
	db = drizzle(client, {
		...config,
		schema,
		logger: ENABLE_DRIZZLE_LOGGER ? Boolean(ENABLE_DRIZZLE_LOGGER) : dev,
	});
}

export { db, client as connection };
