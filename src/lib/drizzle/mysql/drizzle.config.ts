import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: './src/lib/drizzle/mysql/schema.ts',
	dialect: 'mysql',
	dbCredentials: {
		host: process.env.MYSQL_DB_HOST as string,
		port: Number(process.env.MYSQL_DB_PORT),
		user: process.env.MYSQL_DB_USER as string,
		password: process.env.MYSQL_DB_PASSWORD as string,
		database: process.env.MYSQL_DB_NAME as string
	},
	out: './src/lib/drizzle/mysql/migrations/data'
} satisfies Config;
