const dropdownBtns = document.querySelectorAll('.modal-dropdown');
const dropdownOptions = document.querySelectorAll('.dropdown-option');
const modal = document.querySelector('[data-modal="exerciseChoices"]');
const inputName = document.querySelector('#exerciseName');
const inputGroup = document.querySelector('#group');

dropdownBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const visibleElement = document.querySelector('.visible');
    if (visibleElement) {
      visibleElement.classList.remove('visible');
    }
    e.target.nextElementSibling.classList.add('visible');
  });
});

dropdownOptions.forEach(option => {
  option.addEventListener('click', e => {
    inputName.value = option.textContent;
    const muscleName =
      option.parentElement.previousElementSibling.getAttribute('data-muscle');
    const groupTags = document.querySelectorAll('.group-choice');
    const muscleTargetInput = document.querySelector('#muscleTarget')
    groupTags.forEach(groupTag => {
      groupTag.remove();
    });
    muscleTargetInput.textContent = ""
    // addTag function is already defined in dropdownTags.js file
    addTag(muscleName);
  });
});
