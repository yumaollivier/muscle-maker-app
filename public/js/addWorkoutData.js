const trainingIds = document.querySelectorAll('[data-id]');
const trainingIdsInput = document.querySelector('#trainingIds');

const arrayId = [];

trainingIds.forEach(trainingId => {
  arrayId.push(trainingId.getAttribute('data-id'));
});

const idsString = arrayId.join(',')
trainingIdsInput.value = idsString;
