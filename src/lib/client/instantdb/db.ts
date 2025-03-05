import { init, InstantCoreDatabase } from '@instantdb/core';
import { schema } from './schema';
import { PUBLIC_APP_ID } from '$env/static/public'
import { browser } from '$app/environment';


export class ClientDatabase {
  private static instance: ClientDatabase | null = null;
  private static _db: InstantCoreDatabase<typeof schema>;
  get db(): InstantCoreDatabase<typeof schema> {
    return ClientDatabase._db ?? this.startDb();
  }
  
  constructor() {
    this.startDb();
  }
  
  private startDb() {
    if (!ClientDatabase._db) ClientDatabase._db = init({ appId: PUBLIC_APP_ID, schema });
    return ClientDatabase._db;
  }
  
  static connect(): InstantCoreDatabase<typeof schema> {
    if (!browser) console.error(`ClientDatabase can only be instantiated in the browser.`);
    if (!this.instance && browser) this.instance = new ClientDatabase();
    return this.instance?.db as InstantCoreDatabase<typeof schema>;
  }
  
}

export type ClientDatabaseSchema = InstantCoreDatabase<typeof schema>;
export const db = (browser ? ClientDatabase.connect() : null) as unknown as ClientDatabaseSchema;