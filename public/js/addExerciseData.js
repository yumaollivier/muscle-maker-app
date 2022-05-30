const addSetButton = document.querySelector('#addSet');
const addTrainingButtons = document.querySelectorAll('#addExercise');

const addSchemaArray = () => {
  const schemaArray = [];
  const schemaDatas = document.querySelectorAll('.set-table__input-field');
  const exerciseSchemaInput = document.querySelector('#exerciseSchema');
  schemaDatas.forEach(schemaData => {
    const set = schemaData.querySelector('.set').textContent;
    const reps = schemaData.querySelector('#reps').value;
    const rest = schemaData.querySelector('#rest').value;
    exerciseSchema = `${set},${reps},${rest}`
    schemaArray.push(exerciseSchema);
  });
  const schemaString = schemaArray.join('-')
  exerciseSchemaInput.value = schemaString;
};
if(addSetButton){
  addSetButton.addEventListener('click', e => {
    e.preventDefault();
    addSchemaArray();
  });
}

addTrainingButtons.forEach(addTrainingButton => {
  addTrainingButton.addEventListener('click', () => {
    addSchemaArray();
  });
})
