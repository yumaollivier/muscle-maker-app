const addButton = document.querySelector('#addSet');
const table = document.querySelector('.set-table');

let i = 1;

const addSet = () => {
  i++;
  //   TR
  const newSetEl = document.createElement('tr');
  newSetEl.setAttribute('id', i);
  newSetEl.className = 'set-table__input-field';
  // TD with set number
  const newSetNumber = document.createElement('td');
  newSetNumber.className = 'set';
  newSetNumber.innerText = i;
  // TD with reps input
  const newRepsNumber = document.createElement('td');
  newRepsNumber.className = 'reps';
  // Reps input
  const repsInput = document.createElement('input');
  repsInput.setAttribute('name', 'reps');
  repsInput.setAttribute('type', 'number');
  repsInput.className = 'input-field__input';
  // TD with rest input
  const newRestNumber = document.createElement('td');
  newRestNumber.className = 'rest';
  // Rest input
  const restInput = document.createElement('input');
  restInput.setAttribute('name', 'rest');
  restInput.setAttribute('type', 'number');
  restInput.className = 'input-field__input';
  // Delete cross
  const newDeleteCross = document.createElement('td');
  newDeleteCross.setAttribute('id', i);
  newDeleteCross.className = 'delete red-font bold';
  newDeleteCross.innerText = 'X';
  newDeleteCross.addEventListener('click', e => deleteElement(e));
  // Append
  newRepsNumber.appendChild(repsInput);
  newRestNumber.appendChild(restInput);
  newSetEl.appendChild(newSetNumber);
  newSetEl.appendChild(newRepsNumber);
  newSetEl.appendChild(newRestNumber);
  newSetEl.appendChild(newDeleteCross);
  table.appendChild(newSetEl);
};

const deleteElement = e => {
    e.target.parentNode.remove()
    const setElements = document.querySelectorAll('.set')
    setElements.forEach((element, index) => {
        console.log(element + " " + index);
        element.innerHTML = index + 1;
    })
};

addButton.addEventListener('click', () => {
  addSet();
});
