const startBtns = document.querySelectorAll('#startTimer');
const flags = document.querySelectorAll('.flag-exercise');
const chronos = document.querySelectorAll('.chrono');
const chronoCross = document.querySelectorAll('.chrono__cross');
const valueControllers = document.querySelectorAll('.value-controller');
const zoomIcons = document.querySelectorAll('.timer-zoom');
const nextBtns = document.querySelectorAll('#next');
const startContainer = document.querySelector('.start-container');
const flagContainers = document.querySelectorAll('.flag__container');
const addSetBtn = document.querySelector('#addSet');

valueControllers.forEach(valueController => {
  valueController.addEventListener('click', e => {
    const parentElement = valueController.parentNode;
    const inputTarget = parentElement.querySelector('.start-field__input');
    const stepInput = Number(inputTarget.step);
    let inputValue = inputTarget.value;
    if (valueController.innerHTML == '-' && inputValue > 0) {
      inputTarget.value = +inputValue - stepInput;
    } else if (valueController.innerHTML == '+' && inputValue >= 0) {
      inputTarget.value = +inputValue + stepInput;
    }
  });
});

flags.forEach((flag, i) => {
  flag.addEventListener('click', e => {
    if (
      flag !== startBtns[i] &&
      flag.classList.contains('flag-exercise')
    ) {
      const visibleElement = document.querySelector('.visible');
      if (visibleElement != null) {
        visibleElement.classList.remove('visible');
      }
      flag.classList.add('visible');
    }
  });
});

const secondsToMS = duration => {
  duration = Number(duration);
  let m = Math.floor((duration % 3600) / 60);
  let s = Math.floor((duration % 3600) % 60);
  m = m > 9 ? `${m}` : `0${m}`;
  s = s > 9 ? `${s}` : `0${s}`;
  return { minutes: m, seconds: s };
};

const startTimer = element => {
  const timerDurationInS = element.getAttribute('data-time');
  const chronoCounter = element.querySelector('.chrono__counter');
  const chronoLevel = element.querySelector('.chrono__duration-level');
  const bipSound = element.querySelector('#bipSound');
  const miniBipSound = element.querySelector('#miniBipSound');
  const cross = element.querySelector('.chrono__cross');
  let duration = timerDurationInS;
  chronoLevel.style.animationDuration = timerDurationInS + 's';
  element.classList.add('start');
  const timerDurationInMAndS = secondsToMS(timerDurationInS);
  chronoCounter.innerHTML =
    timerDurationInMAndS.minutes + ':' + timerDurationInMAndS.seconds;
  const interval = setInterval(() => {
    if (duration === 16) {
      miniBipSound.playbackRate = 3;
      miniBipSound.play();
      miniBipSound.loop = false;
      chronoLevel.classList.add('warning-bar');
    }
    if (duration === 1) {
      bipSound.play();
      bipSound.loop = false;
      chronoLevel.classList.remove('warning-bar');
    }
    if (duration > 0) {
      duration--;
      const timerDuration = secondsToMS(duration);
      chronoCounter.innerHTML =
        timerDuration.minutes + ':' + timerDuration.seconds;
    } else {
      clearInterval(interval);
      element.style.display = 'none';
    }
  }, 1000);
  cross.addEventListener('click', e => {
    clearInterval(interval);
    bipSound.pause();
    bipSound.currentTime = 0;
    cross.parentNode.style.display = 'none';
  });
};

startBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const visibleElement = document.querySelector('.visible');
    const weightValue = visibleElement.querySelector('[name="weight"]').value;
    const allFlags = [...flags];
    const nextElement = allFlags[allFlags.indexOf(visibleElement) + 1];
    if (nextElement !== undefined) {
      const nextWeightInput = nextElement.querySelector('[name="weight"]');
      nextWeightInput.value = weightValue;
    }
    const attr = btn.getAttribute('data-start');
    const timer = document.querySelector(`.chrono[data-start='${attr}']`);
    timer.style.display = 'flex';
    startTimer(timer);
  });
});

zoomIcons.forEach(zoomIcon => {
  zoomIcon.addEventListener('click', e => {
    const targetElement = e.target.parentElement;
    targetElement.classList.toggle('zoom');
    if (targetElement.classList.contains('zoom')){
      zoomIcon.src = '/img/zoomout.svg'
    } else {
      zoomIcon.src = '/img/zoom.svg'
    }
  });
});

nextBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const visibleElement = btn.parentElement.parentElement;
    if (!startContainer.classList.contains('circuit-container')) {
      visibleElement.classList.add('bordered', 'green-border');
      visibleElement.classList.remove('visible');
      visibleElement.nextElementSibling.nextElementSibling.classList.add('visible');
    } else {
      const flagsArray = Object.values(flags)
      const flagId = flagsArray.indexOf(visibleElement)
      if(btn.innerText === 'Valider'){
        const flagContainer = visibleElement.parentElement;
        flagContainer.classList.add('bordered', 'green-border');
        const circuitBanner = flagContainer.querySelector(
          '.flag__circuit-banner'
        );
        circuitBanner.style.backgroundColor = '#1dd1a1';
      }
      visibleElement.classList.remove('visible');
      flags[flagId + 1].classList.add('visible')
    }
  });
});


