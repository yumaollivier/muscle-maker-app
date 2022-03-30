const hmbMenu = document.querySelector('.hamburger-menu');
const backArrow = document.querySelector('.back');
const menuContainer = document.querySelector('.menu-container');

if (!hmbMenu.classList.contains('back')) {
  hmbMenu.addEventListener('click', () => {
    hmbMenu.classList.toggle('active');
    menuContainer.classList.toggle('active');
  });
}

if(backArrow){
  backArrow.addEventListener('click', () => {
    const prevPath = backArrow.getAttribute('data-path');
    if (prevPath) {
      return (location.href = prevPath);
    } else {
      window.history.back();
    }
  });
}
