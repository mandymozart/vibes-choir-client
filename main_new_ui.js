let midiIn = [],
  midiOut = [];
let role; // main, group, all
let group = 0; // index empty if main
const CC_GROUP = 64;
const GROUPS = 5;
// const groups = [0, 1, 2, 3, 4];

const rootEl = document.querySelector('#app');
const devicesList = document.querySelector('#devices');
const eventsList = document.querySelector('#events');
const imageEl = document.querySelector('#image');
const CHANNEL = 'generator';

const API_KEY = 'r2AAWg.vXWn6Q:wnik03gWqgiNl9Co_zBmO-ySJODrhBJ8kFSkQ8Q0Sic';
let channel;
let isPlaying = false;
function setIsPlaying(value) {
  if (!isPlaying && typeof value === 'undefined') isPlaying = true;
  else isPlaying = value;
}
// Always connect
const realtime = new Ably.Realtime({ key: API_KEY });
channel = realtime.channels.get(CHANNEL);

const blankImage =
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2Z4ZHY2a2hxaHFhaDliaDBpcjNpbWlsbTRnaDFwcGIyMXBzOTgwZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wgCtRNiCgYhlSCnNsM/giphy.gif';
//   'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

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

function stop() {
  imageEl.src = blankImage;
  setIsPlaying(false);
  rootEl.classList.add('stopped');
}

async function chooseGroup(index) {
  index = typeof index === 'undefined' ? group : index;
  role = 'group';
  rootEl.classList.add('group');
  // make sure to assign to group
  switchGroup(index);

  await channel.subscribe((message) => {
    console.log('Received: ', message.data);
    const data = message.data;
    // Play image if subscribed to this group
    if (data.role === 'group' && data.group === group) {
      setIsPlaying(true);
      rootEl.classList.remove('stopped');
      playImage(data.note);
    }
    if (data.role === 'all') {
      stop();
    }
  });
}

function switchGroup(index) {
  rootEl.classList.remove('group--' + group);
  group = index;
  rootEl.classList.add('group--' + index);
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
    devicesList.innerHTML = '';
  }
  for (let input of midiIn) {
    // Add the input device to the list
    const listItem = document.createElement('li');
    listItem.textContent = input.name;
    devicesList.appendChild(listItem);
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

function valueToGroupIndex(value) {
  return Math.round((value / 127) * GROUPS);
}

function midiMessageReceived(event) {
  if (!channel) {
    console.error('not connected to websocket');
    return;
  }
  // MIDI commands we care about. See
  // http://webaudio.github.io/web-midi-api/#a-simple-monophonic-sine-wave-midi-synthesizer.
  const CONTROL_CHANGE = 11; // MIDI Control Change command
  const NOTE_ON = 9;
  const NOTE_OFF = 8;

  const cmd = event.data[0] >> 4;
  const pitch = event.data[1];
  const velocity = event.data.length > 2 ? event.data[2] : 1;

  // Check if it's a Control Change command
  if (cmd === CONTROL_CHANGE) {
    // Extract the control change number
    const cc = event.data[1];
    // Call changeGroup function with cc as argument
    if (cc === CC_GROUP) {
      //   let newGroup = valueToGroupIndex(event.data[2]);
      let newGroup = event.data[2];
      console.log(
        `🕹️ from ${event.srcElement.name} cc: channel: ${event.data[1]}, value: ${event.data[2]}, newGroup: ${newGroup}`,
      );
      if (newGroup !== group) {
        group = newGroup;
        switchGroup(group);
      }
    } else if (cc === 123) {
      console.log('typebeat stopped');
      channel.publish(CHANNEL, { role: 'all', note: pitch, group: group });
      rootEl.classList.add('stopped');
    } else {
      console.log('unhandled cc:' + cc);
    }
  }
  // Note that not all MIDI controllers send a separate NOTE_OFF command for every NOTE_ON.
  else if (cmd === NOTE_OFF || (cmd === NOTE_ON && velocity === 0)) {
    // TODO: handle NOTE OFF LOGIC
  } else if (cmd === NOTE_ON) {
    console.log(
      `🎧 from ${event.srcElement.name} note on: pitch:${pitch}, velocity: ${velocity}`,
    );
    // check if playing is set
    setIsPlaying();
    rootEl.classList.remove('stopped');
    channel.publish(CHANNEL, { role: 'group', note: pitch, group: group });
    const eventsItem = document.createElement('div');
    eventsItem.textContent = 'Note: ' + pitch + ' Group: ' + group;
    eventsList.innerHTML = '';
    eventsList.append(eventsItem);
    playImage(pitch);
    // void
  }
}
