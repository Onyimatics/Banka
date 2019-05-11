/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const userDetails = JSON.parse(localStorage.getItem('userDetails'));
const accountsUrl = 'https://bankaapp.herokuapp.com/api/v2/accounts';
// const accountsUrl = 'http://localhost:3000/api/v2/accounts';
const token = localStorage.getItem('token');

const errorDiv = document.querySelector('.errors');
const errorContainer = document.querySelector('.errors ul');
const userName = document.getElementById('user-name');
const role = document.getElementById('role');
const superUserBtn = document.getElementById('superuser');
const accountsTabContent = document.getElementById('account-content');


const createNode = element => document.createElement(element);
const options = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    Authorization: token,
  }),
};

const loadProfileDetails = () => {
  userName.innerText = `${userDetails.firstName} ${userDetails.lastName}`;
  if (userDetails.type === 'staff') {
    role.innerText = userDetails.isadmin === 'true' ? 'Admin' : 'Cashier';
  }
  if (userDetails.isadmin === false) {
    superUserBtn.style.display = 'none';
  }
};

const loadAccounts = () => {
  fetch(accountsUrl, options)
    .then(res => res.json())
    .then((response) => {
      let htmlList = '';
      if (response.status === 200) {
        response.accounts.forEach((account) => {
          htmlList += `
          <div class="account-item">
            <div class="acct">
              <span class="item-label">${account.type}</span>
              <span class="item-content acc-no">${account.accountNumber}</span>
            </div>
            <div class="acct">
              <span class="item-label">Balance</span>
              <span class="item-content">NGN ${account.balance}</span>
            </div>
            <div class="info">
              <button class="acct-details" onclick="loadAccountDetails('${account.type}', '${account.accountNumber}', '${account.balance}')">
                <i class="fas fa-info"></i><span class="large-screen">Details</span>
              </button>
            </div>
          </div>
          `;
        });
        accountsTabContent.innerHTML = htmlList;
      }

      if (response.status === 404) {
        accountsTabContent.innerText = 'You do not have any accounts';
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
