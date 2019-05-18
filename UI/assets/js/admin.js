/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

const userDetails = JSON.parse(localStorage.getItem('userDetails'));
const token = localStorage.getItem('token');
const errorDiv = document.querySelector('.errors');
const errorContainer = document.querySelector('.errors ul');
const createNode = element => document.createElement(element);
const append = (parent, el) => parent.appendChild(el);
const userName = document.getElementById('user-name');
// const userEmail = document.getElementById('user-email');
const role = document.getElementById('role');
// const superUserBtn = document.getElementById('superuser');
const accountsContainer = document.getElementById('all-accounts');
// const accounts = document.getElementsByClassName('account-details');
const accountsTabContent = document.getElementById('single-account');

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

const loadAllAccounts = () => {
  // const url = 'http://localhost:3000/api/v2/accounts';
  const url = 'https://bankaapp.herokuapp.com/api/v2/accounts';
  fetch(url, options)
    .then(res => res.json())
    .then((response) => {
      const nextURL = './view-account-details.html';
      let htmlList = '';
      if (response.status === 200) {
        response.data.forEach((account) => {
          htmlList += `
            <table class="stats-table"> 
        <tr>
        <th>Account Owner</th>
        <th>Account Number</th>
        <th>Status</th>
        <th>View Account</th>
        <th>Activate/Deactivate</th>
        <th>Delete</th>
        </tr>
            <tr>
                <td>${account.ownerFirstName} ${account.ownerLastName}</td>
                <td>${account.accountNumber}</td>
                <td>${account.status}</td>
                <td>
                <button type="button" class="btn btn-primary"
                 onclick="variab(${account.accountNumber})">
                 View</button></td>
                <td><button id="activate" class="btn btn-warning">Deactivate</button></td>
                <td><button id= "delete-account" class="btn btn-warning delete-account" onclick="triggerDeleteModal()">Delete</button></td>
            </tr>
            </table>
            `;
        });
        // loaderCont.style.display = 'none';
        accountsContainer.innerHTML += htmlList;
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
const variab = (accountNumber) => {
  sessionStorage.setItem('account', accountNumber);
  window.location.href = './view-account-details.html';
};