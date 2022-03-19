const startBtns = document.querySelectorAll('#startTimer');
const flags = document.querySelectorAll('.flag-exercise');
const chronos = document.querySelectorAll('.chrono');
const chronoCross = document.querySelectorAll('.chrono__cross');
const valueControllers = document.querySelectorAll('.value-controller');

const bipSound = new Audio('/sound/bip.mp3');

const playAudio = (audio) => {
    audio.play()
    audio.loop = false;
}

const stopAudio = (audio) => {
    audio.pause()
    audio.currentTime = 0;
}

valueControllers.forEach(valueController => {
  valueController.addEventListener('click', e => {
    const parentElement = valueController.parentNode;
    const inputTarget = parentElement.querySelector('.start-field__input');
    const stepInput = Number(inputTarget.step);
    let inputValue = inputTarget.value;
    if (valueController.innerHTML == '-' && inputValue > 0) {
      inputTarget.value = +inputValue - stepInput;
      console.log(inputValue);
    } else if (valueController.innerHTML == '+' && inputValue >= 0) {
      inputTarget.value = +inputValue + stepInput;
    }
  });
});

flags.forEach(flag => {
  flag.addEventListener('click', e => {
    const visibleElement = document.querySelector('.visible');
    if (visibleElement != null) {
      visibleElement.classList.remove('visible');
    }
    flag.classList.add('visible');
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
  let duration = timerDurationInS;
  chronoLevel.style.animationDuration = timerDurationInS + 's';
  element.classList.add('start');
  const timerDurationInMAndS = secondsToMS(timerDurationInS);
  chronoCounter.innerHTML =
    timerDurationInMAndS.minutes + ':' + timerDurationInMAndS.seconds;
  const interval = setInterval(() => {
    if (duration === 1) {
      bipSound.play();
      bipSound.loop = false;
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
};

startBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const attr = e.target.getAttribute('data-start');
    const timer = document.querySelector(`.chrono[data-start='${attr}']`);
    timer.style.display = 'flex';
    startTimer(timer);
    const visibleElement = document.querySelector('.visible');
    flags.forEach(flag => {
      if (flag === visibleElement) {
        console.log(flags[flag]);
      }
    });
  });
});

chronoCross.forEach(cross => {
  cross.addEventListener('click', e => {
    cross.parentNode.style.display = 'none';
    bipSound.pause();
    bipSound.currentTime = 0;
  });
});
