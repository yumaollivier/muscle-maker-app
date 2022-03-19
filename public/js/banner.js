const hmbMenu = document.querySelector('.hamburger-menu');
const menuContainer = document.querySelector('.menu-container');

if (!hmbMenu.classList.contains('back')) {
  hmbMenu.addEventListener('click', () => {
    hmbMenu.classList.toggle('active');
    menuContainer.classList.toggle('active');
  });
}
