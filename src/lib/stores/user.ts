import type { User } from '$lib/drizzle/postgres/db.model';
import { writable } from 'svelte/store';

const UserStore = writable<User[]>([]);

export default UserStore;