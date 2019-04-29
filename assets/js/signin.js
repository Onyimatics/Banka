/* eslint-disable no-else-return */
/* eslint-disable no-undef */
const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
const passwordRegex = /^[a-zA-Z0-9]{8,}$/;

const errorDiv = document.querySelector('#signin-error');

const handleInputChange = (message) => {
  errorDiv.innerHTML = message;
};


const signin = (email, password) => {
  if (!emailRegex.test(email) || !passwordRegex.test(password)) {
    errorDiv.innerHTML = 'Invalid Email or password.';
    return false;
  }
  return true;
};

const signInForm = document.querySelector('.form-card');
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  if (!signin(email, password)) {
    return false;
  }
  errorDiv.innerHTML = '';
  const response = await fetchData(`${baseUrl}/auth/signin`, 'post', { email, password });
  if (!response || response.status === 500) {
    handleInputChange('Error connecting to server');
    return false;
  } if (response.status === 400) {
    handleInputChange('Username or password is incorrect');
    return false;
  } else {
    handleInputChange('Welcome');
  }
  const { data } = response;
  if (data.type === 'client') { window.location.href = 'user-dashboard.html'; }
  if (data.isadmin === 'true') { window.location.href = 'admin-dashboard.html'; }
  window.href = 'staff-dashboard.html';
});
