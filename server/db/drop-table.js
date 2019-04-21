/* eslint-disable no-console */
import pool from './config';

const dropUsersTable = 'DROP TABLE users';
const dropAccountsTable = 'DROP TABLE accounts CASCADE';
const dropTransactionsTable = 'DROP TABLE transactions';

async function deleteTables() {
  try {
    await pool.query(dropUsersTable);
    await pool.query(dropAccountsTable);
    await pool.query(dropTransactionsTable);
    console.log('Tables deleted');
  } catch (error) {
    console.log('Tables didn\'t drop');
  }
}

deleteTables();
