const completeButton = document.querySelector('#complete');
const numberOfExercise = document.querySelector('#numberOfExercise').value;
const flagContainer = document.querySelectorAll('.flag__container');

// "date-set,reps,weight,rest,notes-set,reps,weight,rest,notes-set,reps,weight,rest/date-set,reps,weight,rest-set,reps,weight,rest-set,reps,weight,rest"
const daysName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const monthsName = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const date = new Date()
const day = daysName[date.getDay()]
const dayDate = date.getDate()
const month = monthsName[date.getMonth()]
const year = date.getFullYear()
const fullDate = `${day} ${dayDate} ${month} ${year}`

const addSchemaArray = () => {
  const arr = []
  const exerciseSets = document.querySelectorAll('.flag-exercise');
  const exercisePerfInput = document.querySelector('#exercisePerf');
  for(let j = 0; j < numberOfExercise; j++) {
    const schemaArray = [fullDate];
    const exId = j + 1
    // const fil = exerciseSets.filter(ex => {return ex.getAttribute('data-id') === exId})
    exerciseSets.forEach(exerciseSet => {
      if(exerciseSet.getAttribute('data-id') == exId) {
        const set = exerciseSet.getAttribute('data-set');
        const reps = exerciseSet.querySelector('[name="reps"]').value;
        const weight = exerciseSet.querySelector('[name="weight"]').value;
        const rest = exerciseSet.querySelector('#restTimer').value;
        const notes = exerciseSet.querySelector('[data-notes]').value;
        const exerciseSchema = `${set},${reps},${weight},${rest},${notes}`;
        schemaArray.push(exerciseSchema);
      }
    })
    const schemaString = schemaArray.join('-');
    arr.push(schemaString)
  }
  const schemaString = arr.join('|');
  exercisePerfInput.value = schemaString;
};
addSchemaArray()
completeButton.addEventListener('click', e => {
  addSchemaArray();
});
