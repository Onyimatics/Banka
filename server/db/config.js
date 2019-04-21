import { Pool } from 'pg';

import dotenv from 'dotenv';

dotenv.config();
const connetionstring = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connetionstring,
});

export default pool;
