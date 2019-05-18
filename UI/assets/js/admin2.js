/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

const userDetails = JSON.parse(localStorage.getItem('userDetails'));
const token = localStorage.getItem('token');
const errorDiv = document.querySelector('.errors');
const errorContainer = document.querySelector('.errors ul');
const createNode = element => document.createElement(element);
const append = (parent, el) => parent.appendChild(el);
const userName = document.getElementById('user-name');
const role = document.getElementById('role');
const accountsContainer = document.getElementById('all-accounts');
const accountsTabContent = document.getElementById('single-account');
const accountNumber = sessionStorage.getItem('account');
const transactionContainer = document.getElementById('transactions');

const options = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    Authorization: token,
  }),
};
const loadAdminProfile = () => {
  if (userDetails.type === 'staff') {
    userName.innerText = `${userDetails.firstName} ${userDetails.lastName}`;
    role.innerText = userDetails.isadmin === 'true' ? 'Admin' : 'Cashier';
  }
};

const loadAccountDetails = (accountNumber) => {
  const url = `https://bankaapp.herokuapp.com/api/v2/accounts/${accountNumber}`;
  //   const url = `http://localhost:3000/api/v2/accounts/${accountNumber}`;
  fetch(url, options)
    .then(res => res.json())
    .then((response) => {
      let accountList = '';
      let account;
      if (response.status === 200) {
        accountList = `
        <h2 style="text-align: center; color: #161b33; margin-top: 20px;">Account Details</h2>
    <br>
  <table class="stats-table" style="text-align: center; color: purple;">
    <tr>
      <td>Acc. Holder</td>
      <td>${response.data.ownerFirstName} ${response.data.ownerLastName}</td> 
    </tr>
    <tr>
      <td>Acc. Number</td>
      <td>${response.data.accountNumber}</td>
    </tr>
    <tr>
      <td>Acc. Type</td>
      <td>${response.data.type}</td> 
    </tr>
    <tr>
      <td>Status</td>
      <td>${response.data.status}</td> 
    </tr>
    <tr>
      <td>Balance</td>
      <td>${response.data.balance}</td> 
    </tr>
  </table>
          `;
      }
      accountsTabContent.innerHTML = accountList;
    })
    .catch((error) => {
      errorDiv.style.display = 'block';
      const msg = createNode('li');
      msg.innerHTML = error.message || 'Error in connecting, Please check your internet connection and try again';
      append(errorContainer, msg);
      setTimeout(() => {
        errorDiv.style.display = 'none';
        errorContainer.innerHTML = '';
      }, 5000);
    });
};

const loadTransactionDetails = (accountNumber) => {
  const url = `https://bankaapp.herokuapp.com/api/v2/accounts/${accountNumber}/transactions`;
  //   const url = `http://localhost:3000/api/v2/accounts/${accountNumber}/transactions`;
  fetch(url, options)
    .then(res => res.json())
    .then((response) => {
      let htmlList = '';
      if (response.status === 200) {
        response.data.forEach((transaction) => {
          htmlList += `
          <table>
            <tr>
        <th>Transaction Date</th>
        <th>Transaction type</th>
        <th>Amount</th>
        <th>Old Balance</th>
        <th>New Balance</th>
        </tr>
        <tr>
          <td>${new Date(transaction.createdOn).getDate()}-${new Date(transaction.createdOn).getMonth() + 1}-${new Date(transaction.createdOn).getFullYear()}
          ${new Date(transaction.createdOn).getHours()}:${new Date(transaction.createdOn).getMinutes()}</td>
          <td>${transaction.type}</td>
          <td>${transaction.amount}</td>
          <td>${transaction.oldBalance}</td>
          <td>${transaction.newBalance}</td>
          </tr>
          </table>
          `;
        });
        transactionContainer.innerHTML = htmlList;
      }
      if (response.status === 404) {
        transactionContainer.innerText = 'No transaction found';
        transactionContainer.style.color = 'purple';
      }
    })
    .catch((error) => {
      errorDiv.style.display = 'block';
      const msg = createNode('li');
      msg.innerHTML = error.message || 'Error in connecting, Please check your internet connection and try again';
      append(errorContainer, msg);
      setTimeout(() => {
        errorDiv.style.display = 'none';
        errorContainer.innerHTML = '';
      }, 5000);
    });
};
