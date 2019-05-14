/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */

const url = 'https://bankaapp.herokuapp.com/api/v2/auth/signup/admin';
// const url = 'http://localhost:3000/api/v2/auth/signup/admin';

const errorDiv = document.querySelector('.erorrs');
const errorContainer = document.querySelector('.erorrs ul');
const { token } = localStorage;
const isAdminRegex = /(true|false)$/i;
const firstnameRegex = /^[a-zA-Z]{3,25}$/;
const lastnameRegex = /^[a-zA-Z]{3,25}$/;
const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
const passwordRegex = /^[a-zA-Z0-9]{8,}$/;

const firstNameError = document.querySelector('#firstName-error');
const lastNameError = document.querySelector('#lastName-error');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const isAdminError = document.querySelector('#isadmin-error');

const signUp = (isadmin, firstname, lastname, email, password) => {
  let value = 1;
  if (!isAdminRegex.test(isadmin)) {
    isAdminError.innerHTML = 'Indicate Administrative Post.';
    value -= 1;
  } if (!emailRegex.test(email)) {
    emailError.innerHTML = 'email should be of the form name@domain.com.';
    value -= 1;
  } if (!firstnameRegex.test(firstname)) {
    firstNameError.innerHTML = 'First name should be at least 3 characters.';
    value -= 1;
  } if (!lastnameRegex.test(lastname)) {
    lastNameError.innerHTML = 'Last name should be at least 3 characters.';
    value -= 1;
  } if (!passwordRegex.test(password)) {
    passwordError.innerHTML = 'Password should be alphanumeric with at least 8 characters.';
    value -= 1;
  }
  return value;
};


const signUpForm = document.querySelector('.form-card');
const createNode = element => document.createElement(element);
const append = (parent, el) => parent.appendChild(el);

signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isAdmin = document.getElementById('isAdmin').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  isAdminError.innerHTML = '';
  emailError.innerHTML = '';
  firstNameError.innerHTML = '';
  lastNameError.innerHTML = '';
  passwordError.innerHTML = '';

  if (signUp(isAdmin, firstName, lastName, email, password) < 1) {
    return false;
  }

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      isAdmin,
      firstName,
      lastName,
      email,
      password,
    }),
    headers: new Headers({
      'content-Type': 'application/json',
      Authorization: token,
    }),
  })
    .then(res => res.json())
    .then((response) => {
      if (response.status === 409) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
        const li = createNode('li');
        li.innerHTML = `${response.message}, please specify a new email <br>`;
        append(errorContainer, li);
        return setTimeout(() => {
          errorDiv.style.display = 'none';
          errorContainer.innerHTML = '';
        }, 5000);
      }
      if (response.status === 201) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'green';
        const li = createNode('li');
        li.innerHTML = `${response.message}, Welcome!!! <br>`;
        append(errorContainer, li);
        setTimeout(() => {
          window.location = './admin-dashboard.html';
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
});
