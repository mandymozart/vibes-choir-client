/* This code will continuously loop through the sequence with a 2-second interval, 
and when it reaches the end of the sequence, it will start again from the beginning.
*/
// EXPOSED PARAMETERS
let TEMPO = 120; // bpm
let NOTE_LENGTH = 12; // quarters
let GROUP_OFFSET = 8; //
let LFO_RATE = 5; // hz
let TOTAL_STEPS = 24;
let GROUPS = 5; // Example: one sequence per group
let PLAYING = false; // Flag to control loop

const playButtonEl = document.querySelector('#playButton');
const playIndicatorEl = document.querySelector('#playIndicator');

// Example usage:
const nQuarterBeats = 4; // Number of quarter beats
const milliseconds = msPerBeat(5);
console.log('Milliseconds:', milliseconds);

function randomNumberOfRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const weightedNotes = {
  48: 0.05,
  49: 0.05,
  50: 0.05,
  51: 0.05,
  52: 0.05,
  53: 0.05,
  54: 0.05,
  55: 0.05,
  56: 0.05,
  57: 0.05,
  58: 0.05,
  59: 0.05,
  60: 0.05,
  61: 0.05,
  62: 0.05,
  63: 0.05,
  64: 0.05,
  65: 0.05,
  66: 0.05,
  67: 0.05,
};

function generateWeightedGroups(groups) {
  const weightedGroups = {};
  const weight = 1 / groups; // Equal weight for each group
  for (let i = 0; i < groups; i++) {
    weightedGroups[i] = weight;
  }
  return weightedGroups;
}

const weightedGroups = generateWeightedGroups(GROUPS);

function generateSequence() {
  const sequence = [];
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const message = {
      role: 'group',
      note: weightedRand(weightedNotes),
      group: weightedRand(weightedGroups),
    };
    sequence.push(message);
  }
  return sequence;
}

async function playSequence(sequence, sequenceNumber) {
  return new Promise((resolve) => {
    let step = 0;
    const interval = setInterval(() => {
      if (!PLAYING) {
        clearInterval(interval); // Stop interval if not playing
        resolve(); // Resolve the promise when stopped
        return;
      }

      const currentStep = sequence[step];
      console.log(
        `Sequence ${sequenceNumber + 1}, Step ${step + 1}:`,
        currentStep,
      );
      socket.emit('midi_message', currentStep);
      step = (step + 1) % TOTAL_STEPS;

      if (step === 0) {
        clearInterval(interval); // Stop interval after completing all steps
        resolve(); // Resolve the promise when completed
      }
    }, 2000);
  });
}

async function loop() {
  // Generate all sequences
  const sequences = Array.from({ length: GROUPS }, (_, i) =>
    generateSequence(),
  );

  // Play all sequences concurrently
  await Promise.all(
    sequences.map((sequence, index) => playSequence(sequence, index)),
  );

  // If still playing, restart the loop
  if (PLAYING) {
    await loop();
  }
}

function changeColorWithBlink(color1, color2) {
  const millisecondsPerBeat = 60000 / TEMPO;
  let currentColor = color1;
  let isBlinking = false;

  function blink() {
    isBlinking = true;
    setTimeout(() => {
      isBlinking = false;
      toggleColor();
    }, msPerBeat(TEMPO) / 2);
  }

  function toggleColor() {
    currentColor = currentColor === color1 ? color2 : color1;
    playIndicatorEl.backgroundColor = currentColor;
    if (!isBlinking && PLAYING) {
      blink();
    }
  }

  toggleColor(); // Start with the first color
}

// Example usage:
const color1 = 'white';
const color2 = 'blue';
changeColorWithBlink(color1, color2);

function playDemo() {
  PLAYING = true;
  loop();
  playButtonEl.innerHTML = 'Stop';
  rootEl.classList.add('isPlaying');
  console.log('Started demo');
}

function stopDemo() {
  PLAYING = FALSE;
  playButtonEl.innerHTML = 'Play Demo';
  rootEl.classList.remove('isPlaying');
  console.log('Stopped demo');
}
