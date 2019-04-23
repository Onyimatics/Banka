const transactions = [
  {
    type: '\'credit\'', // \'credit\' or debit
    accountNumber: 1102345678,
    cashier: 2, // cashier who consummated the transaction
    amount: 50000.00,
    oldBalance: 100000.00,
    newBalance: 150000.00,
  },

  {
    type: '\'credit\'', // \'credit\' or debit
    accountNumber: 1102345685,
    cashier: 5, // cashier who consummated the transaction
    amount: 50000.00,
    oldBalance: 100000.00,
    newBalance: 150000.00,
  },
  {
    type: '\'debit\'', // \'credit\' or debit
    accountNumber: 1102345685,
    cashier: 5, // cashier who consummated the transaction
    amount: 50000.00,
    oldBalance: 150000.00,
    newBalance: 100000.00,
  },
];
export default transactions;
