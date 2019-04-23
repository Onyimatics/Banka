/* eslint-disable no-await-in-loop */
import pool from './config';
import transactions from '../model/transactions';
import accounts from '../model/accounts';
import users from '../model/users';

const Tables = `CREATE TABLE IF NOT EXISTS users(
      id serial PRIMARY KEY,
      firstname text NOT NULL,
      lastname text NOT NULL,
      email text NOT NULL,
      password text NOT NULL,
      type text NOT NULL,
      isadmin text NOT NULL
    );

  CREATE TABLE IF NOT EXISTS accounts(
    id serial,
    accountnumber int PRIMARY KEY,
    createdon TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    owner int NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    balance real NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions(
    id serial PRIMARY KEY,
    createdon TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type text NOT NULL,
    cashier int NOT NULL,
    amount real NOT NULL,
    oldbalance real NOT NULL,
    newbalance real NOT NULL,
    accountnumber int NOT NULL,
    FOREIGN KEY (accountnumber) REFERENCES  accounts(accountnumber) ON DELETE CASCADE
  );
`;

const queryDb = async (query) => {
  const res = await pool.query(query);
  return res;
};

const create = async (arr, table) => {
  try {
    await pool.query(Tables);
    for (let i = 0, len = arr.length; i < len; i += 1) {
      const values = Object.values(arr[i]);
      const keys = Object.keys(arr[i]);
      const query = `INSERT into ${table} (${keys}) values(${values})`;
      await queryDb(query);
    }
  } catch (error) {
    console.log(error);
  }
};

const createAllTables = async () => {
  try {
    await create(users, 'users');
    await create(accounts, 'accounts');
    await create(transactions, 'transactions');
    console.log('all tables has been created');
  } catch (error) {
    console.log(error);
  }
};


createAllTables();
