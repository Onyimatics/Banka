/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const userDetails = JSON.parse(localStorage.getItem('userDetails'));
// const accountsUrl = 'https://bankaapp.herokuapp.com/api/v2/accounts';
const accountsUrl = 'http://localhost:3000/api/v2/accounts';
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
};

loadProfileDetails();
