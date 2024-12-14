import { createConnection } from 'mysql2/promise';

async function getTableIndexes(database: string) {
  const connection = await createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: database
  });

  try {
    // Get all tables in the database
    const [tables] = await connection.query<any[]>(
      'SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_type = "BASE TABLE"',
      [database]
    );

    // For each table, get its indexes
    for (const tableRow of tables) {
      const tableName = tableRow.TABLE_NAME;  // Changed from table_name to TABLE_NAME
      console.log(`Processing table: ${tableName}`);  // Debug log
      
      const [indexes] = await connection.query('SHOW INDEX FROM ??', [tableName]);
      
      console.log(`\n-- Indexes for table ${tableName}:`);
      console.log(`// Original DrizzleKit generated code:`);
      console.log(`index('???').on(table.columnName),`);
      console.log(`\n// Should be replaced with:`);
      
      const processedIndexes = new Set(); // To handle multi-column indexes
      
      for (const index of indexes as any[]) {
        if (!processedIndexes.has(index.Key_name)) {
          console.log(`index('${index.Key_name}')${index.Non_unique ? '' : '.unique()'}${
            index.Index_type === 'FULLTEXT' ? '.fulltext()' : ''
          }.on(table.${index.Column_name}),`);
          processedIndexes.add(index.Key_name);
        }
      }
    }
  } finally {
    await connection.end();
  }
}

// Usage example
getTableIndexes('choice')
  .catch(error => {
    console.error('Error details:', error);
    process.exit(1);
  });