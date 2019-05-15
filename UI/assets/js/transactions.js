/* eslint-disable consistent-return */

const errorDiv = document.querySelector('.errors');
const errorContainer = document.querySelector('.errors ul');
const { token } = localStorage;
const transactionTypeRegex = /(debit|credit)$/i;
const amountRegex = /^\d+$/;
const accountNumberRegex = /^[0-9]*$/;

const transactionTypeError = document.querySelector('#transaction-type-error');
const amountError = document.querySelector('#amount-error');
const accountNumberError = document.querySelector('#account-number-error');

const create = (type, accountNumber, amount) => {
  let value = 1;
  if (!transactionTypeRegex.test(type)) {
    transactionTypeError.innerHTML = 'Enter a valid transaction type';
    value -= 1;
  } if (!amountRegex.test(amount)) {
    amountError.innerHTML = 'Amount is required and must be a number';
    value -= 1;
  }
  if (!accountNumberRegex.test(accountNumber)) {
    accountNumberError.innerHTML = 'Enter a valid account number';
    value -= 1;
  }
  return value;
};

const append = (parent, el) => parent.appendChild(el);
const createNode = element => document.createElement(element);

const createTransaction = document.querySelector('.form-card');
createTransaction.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  const accountNumber = document.getElementById('account-number').value;
  transactionTypeError.innerHTML = '';
  amountError.innerHTML = '';
  accountNumberError.innerHTML = '';

  if (create(type, amount, accountNumber) < 1) {
    return false;
  }
  // const url = `http://localhost:3000/api/v2/transactions/${accountNumber}/${type}`;
  const url = `https://bankaapp.herokuapp.com/api/v2/transactions/${accountNumber}/${type.value}`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      amount,
      type,
      accountNumber,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((response) => {
      if (response.status >= 400) {
        errorDiv.style.display = 'block';
        const li = createNode('li');
        li.innerHTML = `${response.message}<br>`;
        append(errorContainer, li);
        return setTimeout(() => {
          errorDiv.style.display = 'none';
          errorContainer.innerHTML = '';
        }, 5000);
      }

      if (response.status === 200) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'green';
        const li = createNode('li');
        li.innerHTML = `${response.message} <br>`;
        append(errorContainer, li);
        setTimeout(() => {
          window.location = './staff-dashboard.html';
        }, 3000);
      }
    })
    .catch((error) => {
      errorDiv.style.display = 'block';
      errorDiv.style.color = 'red';
      const msg = createNode('li');
      msg.innerHTML = error.message || 'Error in connecting, Please check your internet connection and try again';
      append(errorContainer, msg);
      setTimeout(() => {
        errorDiv.style.display = 'none';
        errorContainer.innerHTML = '';
      }, 5000);
    });
});
