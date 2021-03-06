/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
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
const activateDeactivateButt = document.getElementById('activate-deactivate');
const deleteAccount = document.getElementById('confirm');
const accountNumber = sessionStorage.getItem('account');
const errorModal = document.querySelector('.errorss');
const errorModalContainer = document.querySelector('.errorss ul');

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
                <td><button type="button" class="btn btn-warning" onclick="updateAccountStatus(${account.accountNumber})">Change Status</button></td>
                <td><button class="btn btn-warning delete-account" onclick="triggerDeleteModal(${account.accountNumber})">Delete</button></td>
            </tr>
            </table>
            `;
        });
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


const updateAccountStatus = (accountNumber, status) => {
  const url = `https://bankaapp.herokuapp.com/api/v2/accounts/${accountNumber}`;
  // const url = `http://localhost:3000/api/v2/accounts/${accountNumber}`;
  const option = {
    method: 'PATCH',
    body: JSON.stringify({
      status,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  };
  fetch(url, option)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'green';
        const li = createNode('li');
        li.innerHTML = `${response.message} <br>`;
        append(errorContainer, li);
        setTimeout(() => {
          if (userDetails.isadmin === 'true') {
            window.location = './admin-dashboard.html'; return window.location;
          }
          window.location = './staff-dashboard.html';
        }, 3000);
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

deleteAccount.addEventListener('click', async () => {
  const url = `https://bankaapp.herokuapp.com/api/v2/accounts/${accountNumber}`;
  // const url = `http://localhost:3000/api/v2/accounts/${accountNumber}`;
  const option = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  };
  await fetch(url, option)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        errorModal.style.display = 'block';
        errorModal.style.color = 'green';
        const li = createNode('li');
        li.innerHTML = `${response.message} <br>`;
        append(errorModalContainer, li);
        setTimeout(() => {
          if (userDetails.isadmin === 'true') {
            window.location = './admin-dashboard.html'; return window.location;
          }
          window.location = './staff-dashboard.html';
        }, 3000);
      }
      if (response.status === 404) {
        errorModal.style.display = 'block';
        errorModal.style.color = 'red';
        const li = createNode('li');
        li.innerHTML = `${response.message} <br>`;
        append(errorModalContainer, li);
        return setTimeout(() => {
          if (userDetails.isadmin === 'true') {
            window.location = './admin-dashboard.html'; return window.location;
          }
          window.location = './staff-dashboard.html';
        }, 3000);
      }
    })
    .catch((error) => {
      errorModal.style.display = 'block';
      const msg = createNode('li');
      msg.innerHTML = error.message || 'Error in connecting, Please check your internet connection and try again';
      append(errorModalContainer, msg);
      setTimeout(() => {
        errorModal.style.display = 'none';
        errorModalContainer.innerHTML = '';
      }, 5000);
    });
});
