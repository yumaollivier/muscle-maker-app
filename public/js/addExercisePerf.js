const completeButton = document.querySelector('#complete');
const buttons = document.querySelectorAll('#startTimer');

buttons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
  });
});

// "date-set,reps,weight,rest-set,reps,weight,rest-set,reps,weight,rest/date-set,reps,weight,rest-set,reps,weight,rest-set,reps,weight,rest"
const daysName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const monthsName = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const date = new Date()
const day = daysName[date.getDay()]
const dayDate = date.getDate()
const month = monthsName[date.getMonth()]
const year = date.getFullYear()
const fullDate = `${day} ${dayDate} ${month} ${year}`

const addSchemaArray = () => {
  const schemaArray = [fullDate];
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
