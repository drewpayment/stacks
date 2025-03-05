import { INSTANTDB_ADMIN_TOKEN } from '$env/static/private';
import { PUBLIC_APP_ID } from '$env/static/public';
import { init, id } from '@instantdb/admin';

export const db = init({
  appId: PUBLIC_APP_ID,
  adminToken: INSTANTDB_ADMIN_TOKEN,
});