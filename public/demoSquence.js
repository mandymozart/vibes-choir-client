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
let NOTES = 20;
let PLAYING = false; // Flag to control loop

const playButtonEl = document.querySelector('#playButton');
const playIndicatorEl = document.querySelector('#playIndicator');

// Example usage:
const nQuarterBeats = 4; // Number of quarter beats
const milliseconds = msPerBeat(TEMPO, 5);
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
            note: parseInt(weightedRand(weightedNotes)),
            duration: NOTE_LENGTH,
            group: parseInt(weightedRand(weightedGroups)),
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
        }, msPerBeat(TEMPO,NOTE_LENGTH));
    });
}

let sequences;
// Generate all sequences
function seedSequences() {
    sequences = Array.from({ length: GROUPS }, (_, i) =>
        generateSequence(),
    );
    console.log("Sequences generated", sequencesToMarkdown(sequences))
    
}
seedSequences();

let intervalId;
// Function to start the blinking
function playBlinking(bpm) {
    const intervalTime = msPerBeat(bpm) / 2; // Blinking interval is half the beat duration

    intervalId = setInterval(() => {
        playIndicatorEl.style.visibility = (playIndicatorEl.style.visibility === 'hidden') ? 'visible' : 'hidden';
    }, intervalTime);
}

// Function to stop the blinking
function stopBlinking() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        playIndicatorEl.style.visibility = 'visible'; // Ensure visibility is reset
    }
}

async function loop() {
    playBlinking(TEMPO); 

    // Play all sequences concurrently
    await Promise.all(
        sequences.map((sequence, index) => playSequence(sequence, index)),
    );

    stopBlinking();

    // If still playing, restart the loop
    if (PLAYING) {
        await loop();
    }
}


function togglePlay() {
    if(PLAYING){
        PLAYING = false;
        playButtonEl.innerHTML = 'Play Demo';
        rootEl.classList.remove('isPlaying');
        console.log('Stopped demo');
    } else {
        PLAYING = true;
        loop();
        playButtonEl.innerHTML = 'Stop';
        rootEl.classList.add('isPlaying');
        console.log('Started demo');
    }
}
