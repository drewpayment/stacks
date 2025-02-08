import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: './src/lib/drizzle/postgres/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.POSTGRES_DB_HOST as string,
		port: Number(process.env.POSTGRES_DB_PORT),
		user: process.env.POSTGRES_DB_USER as string,
		password: process.env.POSTGRES_DB_PASSWORD as string,
		database: process.env.POSTGRES_DB_NAME as string,
		ssl: {
			rejectUnauthorized: false,
		}
	},
	out: './src/lib/drizzle/postgres/migrations/data',
	// schemaFilter: ['drizzle'],
} satisfies Config;
