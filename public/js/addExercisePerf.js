const completeButton = document.querySelector('#complete');
const buttons = document.querySelectorAll('#startTimer');

buttons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
  });
});

const addSchemaArray = () => {
  const date = new Date();
  const schemaArray = [`${date}`];
  const exerciseSets = document.querySelectorAll('.flag-exercise');
  const exercisePerfInput = document.querySelector('#exercisePerf');
  exerciseSets.forEach(exerciseSet => {
    const set = exerciseSet
      .querySelector('.flag-exercise__title')
      .getAttribute('data-set');
    const reps = exerciseSet.querySelector('[name="reps"]').value;
    const weight = exerciseSet.querySelector('[name="weight"]').value;
    const rest = exerciseSet.querySelector('#restTimer').value;
    const exerciseSchema = `${set},${reps},${weight},${rest}`;
    schemaArray.push(exerciseSchema);
  });
  const schemaString = schemaArray.join('-');
  exercisePerfInput.value = schemaString + '/';
};

completeButton.addEventListener('click', e => {
  addSchemaArray();
});
