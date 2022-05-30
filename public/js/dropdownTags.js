const MuscularGroupContainer = document.querySelector('.group-container');
const groupChoices = document.querySelectorAll('#groupChoice');

const addInputGroupData = () => {
  const muscleTargetInput = document.querySelector('#muscleTarget')
  const musclesTarget = document.querySelectorAll('.group-choice')
  const musclesArr = [];
  musclesTarget.forEach(muscle => {
    const muscleGroup = muscle.getAttribute('data-group')
    musclesArr.push(muscleGroup);
  })
  muscleTargetInput.value = musclesArr.join(' ')
}

// WARNING => This function is used in dropdown.js file
const addTag = muscleName => {
  if (muscleName !== 'aucun') {
    const muscleTag = document.createElement('div');
    muscleTag.classList.add('group-choice');
    muscleTag.setAttribute('data-group', muscleName)
    muscleTag.innerHTML = muscleName;
    const deleteSpan = document.createElement('span');
    deleteSpan.classList.add('cross');
    deleteSpan.innerHTML = 'X';
    deleteSpan.addEventListener('click', e => {
      e.target.parentNode.remove();
      addInputGroupData()
    });
    muscleTag.appendChild(deleteSpan);
    MuscularGroupContainer.appendChild(muscleTag);
  }
  addInputGroupData()
}

MuscularGroupContainer.addEventListener('change', e => {
  const muscleName = e.target.value;
  addTag(muscleName)
});
