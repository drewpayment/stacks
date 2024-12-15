import { dev } from '$app/environment';
import {
  ENABLE_DRIZZLE_LOGGER, MYSQL_DB_HOST, MYSQL_DB_PORT, MYSQL_DB_USER, MYSQL_DB_NAME, MYSQL_DB_PASSWORD,
  TUNNEL_HOST, TUNNEL_USER, TUNNEL_PORT, TUNNEL_PRIVATE_KEY, TUNNEL_PRIVATE_KEY_PATH, TUNNEL_DEST_HOST, TUNNEL_DEST_PORT,
  TUNNEL_LOCAL_PORT, TUNNEL_DEBUG,
  MYSQL_USE_SSH
} from '$env/static/private';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import * as mysql from 'mysql2';
import config from './drizzle.config';
import { createTunnel } from 'tunnel-ssh';
import type { Connection } from 'mysql2';
import { runtime } from '$lib/utils';

const debug = (message: string, ...args: any[]) => {
  if (TUNNEL_DEBUG === 'true' || dev) {
    console.log(message, ...args);
  }
};

const getPrivateKey = async (): Promise<string> => {
  try {
    // If TUNNEL_PRIVATE_KEY_PATH is set, read from file
    if (TUNNEL_PRIVATE_KEY_PATH) {
      debug('Reading SSH private key from file...');
      return (runtime.isDeno ? 
        await Deno?.readTextFile(TUNNEL_PRIVATE_KEY_PATH) :
        await import('fs').then(fs => fs.readFileSync(TUNNEL_PRIVATE_KEY_PATH, 'utf8'))) as string;
    }
    
    // Otherwise use the direct key value
    if (TUNNEL_PRIVATE_KEY) {
      debug('Using provided SSH private key...');
      return TUNNEL_PRIVATE_KEY;
    }

    throw new Error('No private key provided. Set either TUNNEL_PRIVATE_KEY or TUNNEL_PRIVATE_KEY_PATH');
  } catch (error) {
    console.error('Failed to get private key:', error);
    throw error;
  }
};

const getTunnelConfig = async () => {
  debug('Getting SSH private key...');
  const privateKey = await getPrivateKey();
  
  if (TUNNEL_DEBUG === 'true') {
    debug('Private key loaded, first line:', privateKey?.split('\n')[0]);
    debug('Private key length:', privateKey?.length);
  }

  return {
    username: TUNNEL_USER,
    host: TUNNEL_HOST,
    port: Number(TUNNEL_PORT),
    privateKey,
    dstHost: TUNNEL_DEST_HOST,
    dstPort: Number(TUNNEL_DEST_PORT),
    localHost: '127.0.0.1',
    localPort: Number(TUNNEL_LOCAL_PORT),
  };
};

const createMySqlConnection = (useLocalhost = false): Connection => {
  const config = {
    host: useLocalhost ? '127.0.0.1' : MYSQL_DB_HOST,
    port: useLocalhost ? Number(TUNNEL_LOCAL_PORT) : Number(MYSQL_DB_PORT),
    user: MYSQL_DB_USER,
    password: MYSQL_DB_PASSWORD,
    database: MYSQL_DB_NAME,
    connectTimeout: 10000,
  };
  debug('Creating MySQL connection with config:', { ...config, password: '***' });
  return mysql.createConnection(config);
};

const waitForTunnel = (server: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const markAsResolved = () => {
      if (!resolved) {
        resolved = true;
        debug('Tunnel is ready');
        resolve();
      }
    };

    const timeout = setTimeout(() => {
      if (!resolved) {
        console.error('Tunnel connection timed out while waiting for ready state');
        reject(new Error('Tunnel connection timed out'));
      }
    }, 20000);

    server.on('listening', () => {
      debug('SSH: Server is listening');
      markAsResolved();
    });

    server.on('connection', () => {
      debug('SSH: Connection received');
      markAsResolved();
    });

    server.on('error', (error: Error) => {
      console.error('SSH: Error event received:', error);
      clearTimeout(timeout);
      reject(error);
    });

    if (server.listening) {
      debug('SSH: Server was already listening');
      markAsResolved();
    }
  });
};

const createConnection = async (): Promise<Connection> => {
  if (dev && MYSQL_USE_SSH === 'false') return createMySqlConnection();

  try {    
    const tunnelConfig = await getTunnelConfig();
    debug('Creating SSH tunnel...');
    
    const debugLogger = TUNNEL_DEBUG === 'true' ? console.log : undefined;
    
    const [server] = await createTunnel(
      { 
        debug: TUNNEL_DEBUG === 'true',
        debugLogger,
        keepAlive: true
      },
      {
        host: '127.0.0.1',
        port: tunnelConfig.localPort,
      },
      {
        host: tunnelConfig.host,
        port: tunnelConfig.port,
        username: tunnelConfig.username,
        privateKey: tunnelConfig.privateKey,
        debug: debugLogger,
        readyTimeout: 20000,
        keepaliveInterval: 10000,
      },
      {
        dstAddr: tunnelConfig.dstHost,
        dstPort: tunnelConfig.dstPort,
      }
    );

    await waitForTunnel(server);

    await new Promise(resolve => setTimeout(resolve, 1000));

    debug('Attempting MySQL connection through tunnel...');
    const connection = createMySqlConnection(true);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MySQL connection timed out'));
      }, 10000);

      connection.connect((err) => {
        clearTimeout(timeout);
        if (err) {
          console.error('MySQL connection error:', err);
          reject(err);
          return;
        }
        debug('Successfully connected to MySQL through SSH tunnel');
        resolve(connection);
      });
    });
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
};

const connection = await createConnection();

const drizzleClient = drizzle(connection, {
  ...config,
  schema,
  mode: 'default',
  logger: ENABLE_DRIZZLE_LOGGER ? Boolean(ENABLE_DRIZZLE_LOGGER) : dev,
});

export { drizzleClient as legacyDb };