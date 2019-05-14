/* eslint-disable no-undef */
/* eslint-disable consistent-return */
// const url = 'http://localhost:3000/api/v2/accounts';
const url = 'https://bankaapp.herokuapp.com/api/v2/accounts';
const token = localStorage.getItem('token');
// const userDetails = JSON.parse(localStorage.getItem('userDetails'));

const accountTypeRegex = /(current|savings)$/i;
const openingBalanceRegex = /^\d+$/;

const errorDiv = document.querySelector('.errors');
const errorContainer = document.querySelector('.errors ul');
const accountTypeError = document.querySelector('#account-type-error');
const openingBalanceError = document.querySelector('#opening-amount-error');

const create = (type, openingBalance) => {
  let value = 1;
  if (!accountTypeRegex.test(type)) {
    accountTypeError.innerHTML = 'Enter a valid account type';
    value -= 1;
  } if (!openingBalanceRegex.test(openingBalance)) {
    openingBalanceError.innerHTML = 'Opening Balance is required and must be a number';
    value -= 1;
  }
  return value;
};
const createAcct = document.querySelector('.form-card');

const append = (parent, el) => parent.appendChild(el);
const createNode = element => document.createElement(element);
createAcct.addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = document.getElementById('account-type').value;
  const openingBalance = document.getElementById('opening-amount').value;

  accountTypeError.innerHTML = '';
  openingBalanceError.innerHTML = '';

  if (create(type, openingBalance) < 1) {
    return false;
  }

  const options = {
    method: 'POST',
    body: JSON.stringify({
      type,
      openingBalance,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  };

  await fetch(url, options)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 201) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'green';
        const li = createNode('li');
        li.innerHTML = `${response.message} <br>`;
        append(errorContainer, li);
        setTimeout(() => {
          window.location = './user-dashboard.html';
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
