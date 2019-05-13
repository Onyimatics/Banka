/* eslint-disable consistent-return */
/* eslint-disable no-else-return */

const url = 'https://bankaapp.herokuapp.com/api/v2/auth/signin';
// const url = 'http://localhost:3000/api/v2/auth/signin';

const { token } = localStorage;
const errorDiv = document.querySelector('.errors');
const errorContainer = document.querySelector('.errors ul');

const signInForm = document.querySelector('.form-card');
const createNode = element => document.createElement(element);

const append = (parent, el) => parent.appendChild(el);
signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
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
      if (response.status === 400) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
        const li = createNode('li');
        li.innerHTML = `${response.message}<br>`;
        append(errorContainer, li);
        return setTimeout(() => {
          errorDiv.style.display = 'none';
          errorContainer.innerHTML = '';
        }, 5000);
      }
      const { data } = response;
      if (response.status === 200) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'green';
        const li = createNode('li');
        li.innerHTML = `${response.message}, Welcome Back!!! <br>`;
        append(errorContainer, li);
        setTimeout(() => {
          if (data.type === 'client') {
            window.location = './user-dashboard.html'; return window.location;
          }
          if (data.isadmin === 'true') {
            window.location = './admin-dashboard.html'; return window.location;
          } else {
            window.location = './staff-dashboard.html';
          }
        }, 3000);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userDetails', JSON.stringify(data));
        localStorage.setItem('loggedIn', true);
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
