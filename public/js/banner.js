const hmbMenu = document.querySelector('.hamburger-menu');
const menuContainer = document.querySelector('.menu-container');

hmbMenu.addEventListener('click', () => {
  hmbMenu.classList.toggle('active')
  menuContainer.classList.toggle('active')
})
