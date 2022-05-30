const hmbMenu = document.querySelector('.hamburger-menu');
const menuContainer = document.querySelector('.menu-container');
const toggleMenu = document.querySelectorAll('[data-menu]');

toggleMenu.forEach(btn => {
  btn.addEventListener('click', () => {
    hmbMenu.classList.toggle('active');
    menuContainer.classList.toggle('active');
  });
});
