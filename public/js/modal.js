const modalButton = document.querySelector('button[data-modal]')
const modalWindow = document.querySelector('.modal')

const closeModal = document.querySelectorAll('[data-close]')

modalButton.addEventListener('click', e => {
    e.preventDefault();
    modalWindow.style.display = 'flex'
})

closeModal.forEach(closer => {
    closer.addEventListener('click', e => {
        modalWindow.style.display = 'none';
    })
})