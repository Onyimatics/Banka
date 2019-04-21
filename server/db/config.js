import { Pool } from 'pg';

import dotenv from 'dotenv';

dotenv.config();
const connetionstring = process.env.DB_TEST_URL;

// const connetionstring = process.env.DB_CONNECTIONSTRING;

const pool = new Pool({
  connectionString: connetionstring,
});

export default pool;
