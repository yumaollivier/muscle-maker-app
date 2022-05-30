const modalButtons = document.querySelectorAll('[data-open]');
const modalWindow = document.querySelector('.modal');

const closeModal = document.querySelectorAll('[data-close]');

modalButtons.forEach(modalBtn => {
  modalBtn.addEventListener('click', e => {
    e.preventDefault();
    const modalData = modalBtn.getAttribute('data-open');
    const modalTarget = document.querySelector(`[data-modal="${modalData}"`);
    closeModals(modalData, modalTarget);
    modalTarget.style.display = 'flex';
  });
});

const closeModals = (modalData, modalTarget) => {
  const closeModalsTarget = document.querySelectorAll(
    `[data-close="${modalData}"]`
  );
  closeModalsTarget.forEach(close => {
    close.addEventListener('click', e => {
      e.preventDefault();
      modalTarget.style.display = 'none';
    });
  });
};
