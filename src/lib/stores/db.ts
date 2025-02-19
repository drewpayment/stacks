import { browser } from '$app/environment';
import { ClientDatabase } from '$lib/client/instantdb/db';


export const db = browser ? ClientDatabase.connect() : null;