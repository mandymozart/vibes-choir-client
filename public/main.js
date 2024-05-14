const SOCKET_URI = 'vibes-choir-client.onrender.com'
let midiIn = [],
  midiOut = [];
let role; // main, group
let group = 0; // index empty if main
// const groups = [0, 1, 2, 3, 4];

const rootEl = document.querySelector('#app');
const devicesListEl = document.querySelector('#devices');
const eventsListEl = document.querySelector('#events');
const connectionIndicatorEl = document.querySelector('#connectionIndicator')
const imageEl = document.querySelector('#image');
// const CHANNEL = 'generator';

const images = [
  {
    note: 48,
    url: 'images/F_on_We_Heart_It.webp',
  },
  {
    note: 49,
    url: 'images/Black_metal.webp',
  },
  {
    note: 50,
    url: 'images/555555555555555555555566666664444444444.webp',
  },
  {
    note: 51,
    url: 'images/Farm_daight_9.webp',
  },
  {
    note: 52,
    url: 'images/Cottagecore.webp',
  },
  {
    note: 53,
    url: 'images/Through_the_prism_of_the_soul.webp',
  },
  {
    note: 54,
    url: 'images/Bloody-knuckles.webp',
  },
];

const imagesUrls = preloadImages(images);
console.log('preloaded > ', imagesUrls);

let socket = io(SOCKET_URI);
// let socket = io();

function join() {
  role = 'group';
  rootEl.classList.add('group');

  // Subscribe to 'midi_message' event emitted by the server
  socket.on('midi_message', (message) => {
    console.log('Received: ', group, message.clientId);
    const data = message.data;
    // Play image if subscribed to this group
    if (data.role === 'group' && data.group === group) {
      playImage(data.note);
    }
  });

  socket.on('hello', (message) => {
    console.log('Welcome! Your clientId is:', message.clientId);
    clientId = message.clientId;
  });
}

function switchGroup(index) {
  rootEl.classList.remove('group--' + group);
  group = index;
  rootEl.classList.add('group--' + index);
  socket.emit('switch', group);
  console.log('Switched Group', group);
}

function playImage(note) {
  // Find the image corresponding to the note
  const image = images.find((img) => img.note === note);
  if (image) {
    // Set the image source
    imageEl.src = image.url;
  } else {
    console.error('Image not found for MIDI note:', note);
  }
}

/* Host a session */
function host(options) {
  socket.emit('host', options);
  connectMidi();
}

/* deprecated */
function connectMidi() {
  navigator.requestMIDIAccess().then(
    (midi) => midiReady(midi),
    (err) => console.log('Something went wrong', err),
  );
}

function midiReady(midi) {
  // Also react to device changes.
  midi.addEventListener('statechange', (event) => initDevices(event.target));
  initDevices(midi); // see the next section!
}

function initDevices(midi) {
  // Reset.
  midiIn = [];
  midiOut = [];

  // MIDI devices that send you data.
  const inputs = midi.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    midiIn.push(input.value);
  }

  // MIDI devices that you send data to.
  const outputs = midi.outputs.values();
  for (
    let output = outputs.next();
    output && !output.done;
    output = outputs.next()
  ) {
    midiOut.push(output.value);
  }

  displayDevices();
  startListening();
}

function displayDevices() {
  if (midiIn.length > 0) {
    devicesListEl.innerHTML = '';
  }
  for (let input of midiIn) {
    // Add the input device to the list
    const listItem = document.createElement('li');
    listItem.textContent = input.name;
    devicesListEl.appendChild(listItem);
    // // Add event listener for MIDI messages
    // input.onmidimessage = onMIDIMessage;
  }
  rootEl.append;
}

// Start listening to MIDI messages.
function startListening() {
  rootEl.classList.add('main');
  for (const input of midiIn) {
    input.addEventListener('midimessage', midiMessageReceived);
  }
}

function midiMessageReceived(event) {
  if (!channel) {
    console.error('not connected to websocket');
    return;
  }
  // MIDI commands we care about. See
  // http://webaudio.github.io/web-midi-api/#a-simple-monophonic-sine-wave-midi-synthesizer.
  const NOTE_ON = 9;
  const NOTE_OFF = 8;

  const cmd = event.data[0] >> 4;
  const pitch = event.data[1];
  const velocity = event.data.length > 2 ? event.data[2] : 1;

  console.log(
    `🎧 from ${event.srcElement.name} note off: pitch:${pitch}, velocity: ${velocity}`,
  );
  // Note that not all MIDI controllers send a separate NOTE_OFF command for every NOTE_ON.
  if (cmd === NOTE_OFF || (cmd === NOTE_ON && velocity === 0)) {
    // void
  } else if (cmd === NOTE_ON) {
    socket.emit('midi_message', { role: 'group', note: pitch, group: group }); // Assuming 'index' is the parameter for joining a specific channel

    const eventsItem = document.createElement('div');
    eventsItem.textContent = 'Note: ' + pitch + ' Group: ' + group;
    eventsListEl.innerHTML = '';
    eventsListEl.append(eventsItem);
    playImage(pitch);
  }
}

let socketConnected = false;
rootEl.classList.add('connecting')
socket.on('connect', () => {
  console.log('Connected to server');
  rootEl.classList.add('ready')
  rootEl.classList.remove('connecting')
  socketConnected = true;
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  rootEl.classList.remove('ready')
  rootEl.classList.add('disconnected')
  socketConnected = false;
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
  // Handle connection error
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  rootEl.classList.add('disconnected')
  rootEl.classList.add('error')
  // Handle connection error
});

socket.on('connect_timeout', () => {
  console.error('Connection timed out');
  rootEl.classList.add('disconnected')
  rootEl.classList.add('error')
  // Handle connection timeout
});