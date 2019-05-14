/* eslint-disable no-unused-vars */
// Get the modal
const modal = document.querySelector('#myModal');
const deleteModal = document.querySelector('#deleteModal');


const triggerModal = () => {
  modal.style.display = 'block';
};

const triggerDeleteModal = () => {
  deleteModal.style.display = 'block';
};


const closeModal = () => {
  modal.style.display = 'none';
};

const closeDeleteModal = () => {
  deleteModal.style.display = 'none';
};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Event handler for toggling menu of mobile devices
const hamburgerBtn = document.querySelector('.hamburger-menu');
hamburgerBtn.addEventListener('click', function toggleMenu() {
  const menu = document.querySelector('.navbar-menu');
  this.classList.toggle('menu-open');
  menu.classList.toggle('menu-open');
});
