/* eslint-disable import/no-mutable-exports */
const accounts = [
  {
    accountNumber: 1102345678,
    owner: 2, //
    type: '\'savings\'', // \'savings\', \'current\'
    status: '\'active\'', // draft, \'active\', or dormant
    balance: 100000.00,
  },
  {
    accountNumber: 1102345679,
    owner: 2, //
    type: '\'savings\'', // \'savings\', \'current\'
    status: '\'dormant\'', // draft, \'active\', or dormant
    balance: 100000.00,
  },
  {
    accountNumber: 1102345677,
    owner: 2, //
    type: '\'current\'', // \'savings\', \'current\'
    status: '\'dormant\'', // draft, \'active\', or dormant
    balance: 100000.00,
  },
  {
    accountNumber: 1102345685,
    owner: 5, //
    type: '\'current\'', // \'savings\', \'current\'
    status: '\'active\'', // draft, \'active\', or dormant
    balance: 100000.00,
  },

];

export default accounts;
