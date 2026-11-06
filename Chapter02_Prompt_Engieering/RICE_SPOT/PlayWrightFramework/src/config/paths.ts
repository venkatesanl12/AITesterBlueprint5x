import { resolve } from 'node:path';

export const AUTH_STATE_PATH = resolve(process.cwd(), 'playwright/.auth/user.json');
