/* eslint-disable no-bitwise */
/* eslint-disable no-else-return */
/* eslint-disable no-undef */
const firstnameRegex = /^[a-zA-Z]{3,25}$/;
const lastnameRegex = /^[a-zA-Z]{3,25}$/;
const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
const passwordRegex = /^[a-zA-Z0-9]{8,}$/;

const errorDiv = document.querySelector('#erorrDiv');
const firstNameError = document.querySelector('#firstName-error');
const lastNameError = document.querySelector('#lastName-error');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');

const handleInputChange = (message) => {
  errorDiv.innerHTML = message;
};


const signup = (firstname, lastname, email, password) => {
  let value = 1;
  if (!emailRegex.test(email)) {
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

const signInForm = document.querySelector('.form-card');
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const firstName = document.querySelector('#firstName').value;
  const lastName = document.querySelector('#lastName').value;

  emailError.innerHTML = '';
  firstNameError.innerHTML = '';
  lastNameError.innerHTML = '';
  passwordError.innerHTML = '';

  if (signup(firstName, lastName, email, password) < 1) {
    return false;
  }
  const response = await fetchData(`${baseUrl}/auth/signup`, 'post', {
    firstName, lastName, email, password,
  });
  if (!response || response.status === 500) {
    errorDiv.style.color = 'red';
    handleInputChange('Error connecting to server');
    return false;
  } if (response.status === 409) {
    errorDiv.style.color = 'red';
    handleInputChange('This user Has been registered');
    return false;
  } else {
    errorDiv.style.color = 'green';
    handleInputChange('Welcome');
  }
  window.location.href = 'user-dashboard.html';
});
