/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const userDetails = JSON.parse(localStorage.getItem('userDetails'));
const token = localStorage.getItem('token');

const errorDiv = document.querySelector('.errors');
const errorContainer = document.querySelector('.errors ul');
const userName = document.getElementById('user-name');
const role = document.getElementById('role');
const superUserBtn = document.getElementById('superuser');
const accountsTabContent = document.getElementById('account');

const append = (parent, el) => parent.appendChild(el);
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
};

const loadAccounts = () => {
  const url = `https://bankaapp.herokuapp.com/api/v2/user/${userDetails.email}/accounts`;
  // const url = `http://localhost:3000/api/v2/user/${userDetails.email}/accounts`;
  fetch(url, options)
    .then(res => res.json())
    .then((response) => {
      let accountList = '';
      if (response.status === 200) {
        response.data.forEach((account) => {
          accountList += `
          <table id="account-content" class="profile-tab">
                <tr>
                <td>${account.accountNumber}</td>
                <td>${account.type}</td>
                <td>${account.Balance}</td>
                </tr>
                
          </table>
          `;
        });
        accountsTabContent.innerHTML = accountList;
      }

      if (response.status === 404) {
        accountsTabContent.innerText = 'No Account found, Click on Create account to create a new bank account';
        accountsTabContent.style.color = 'purple';
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

const loadAccountDetails = (accountNumber, type, Balance) => {
  window.location = './user-dashboard.html';
  localStorage.setItem('accNumber', accountNumber);
  localStorage.setItem('accType', type);
  localStorage.setItem('accBalance', Balance);
};

// if (userDetails.type === 'client') {
//   loadAccounts();
// }

loadAccounts();

loadProfileDetails();
