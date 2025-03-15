import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

dotenv.config();

const dbHost = process.env.POSTGRES_DB_HOST;

if (!dbHost) {
	throw new Error(`No POSTGRES_DB_HOST found, value found: ${process.env.POSTGRES_DB_HOST}`);
}

const connection = postgres({
	host: dbHost,
	port: Number(process.env.POSTGRES_DB_PORT),
	user: process.env.POSTGRES_DB_USER,
	password: process.env.POSTGRES_DB_PASSWORD,
	database: process.env.POSTGRES_DB_NAME,
	max: 1,
	ssl: process.env.NODE_ENV === 'production' ? 'require' : undefined,
});

const drizzleClient = drizzle(connection);

console.log('Migration started ⌛')

await migrate(drizzleClient, { migrationsFolder: 'src/lib/drizzle/postgres/migrations/data', })
	.then(() => {
		console.log('Migration completed ✅')
		process.exit(0);
	})
	.catch((err) => {
		console.error('Migration failed 🚨:', err)
		throw err;
	})
	.finally(async () => {
		await connection.end();
	});
