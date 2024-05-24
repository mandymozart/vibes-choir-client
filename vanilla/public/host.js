let midiInputs = [],
  midiOut = [];
const selectedInputDevices = [];

const groupsEl = document.querySelector('.groups');

if (!isMobileDevice()) rootEl.classList.add('can-host');

function previewContent(note, _group) {
  // Find the content corresponding to the note
  const content = getContent(note);
  if (content) {
    // switch content
    const groupsContentsEl = groupsEl.querySelector(
      `[data-group-id="${_group}"]`,
    );
    groupsContentsEl
      .querySelectorAll('.content')
      .forEach((el) => (el.style.display = 'none'));
    if (content.media.type === 'image') {
      groupsContentsEl.querySelector('.content--image img').src =
        content.media.url;
      groupsContentsEl.querySelector('.content--image').style.display = 'block';
    }
    if (content.media.type === 'onomatopoeia') {
      groupsContentsEl.querySelector('.content--onomatopoeia').textContent =
        content.media.text;
      groupsContentsEl.querySelector('.content--onomatopoeia').style.display =
        'flex';
    }
  } else {
    console.error('Content not found for MIDI note:', note);
  }
}

function stopPreviewContent(note, _group) {
  // Find the group container
  const groupsContentsEl = groupsEl.querySelector(
    `[data-group-id="${_group}"]`,
  );
  // Make content invisible
  groupsContentsEl
    .querySelectorAll('.content')
    .forEach((el) => (el.style.display = 'none'));
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
    (err) => console.error('Something went wrong', err),
  );
}

function midiReady(midi) {
  // Also react to device changes.
  midi.addEventListener('statechange', (event) => initDevices(event.target));
  initDevices(midi); // see the next section!
}

function initDevices(midi) {
  // Reset.
  midiInputs = [];
  midiOut = [];

  // MIDI devices that send you data.
  const inputs = midi.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    if (input.value.name) {
      midiInputs.push(input.value);
    }
  }
  const inputDevices = InputDevicesSelector(midiInputs, selectedInputDevices);

  // MIDI devices that you send data to.
  const outputs = midi.outputs.values();
  for (
    let output = outputs.next();
    output && !output.done;
    output = outputs.next()
  ) {
    midiOut.push(output.value);
  }

  startListening();
}

// Start listening to MIDI messages.
function startListening() {
  rootEl.classList.add('main');
  for (const input of midiInputs) {
    input.addEventListener('midimessage', midiMessageReceived);
  }
}

function midiMessageReceived(event) {
  if (!selectedInputDevices.includes(event.currentTarget.id)) {
    console.warn(
      `MIDI Device ${event.currentTarget.name} (ID: ${event.currentTarget.id}) is not selected and therefore all events are ignored on this device.`,
      event.currentTarget,
    );
    return;
  }
  // MIDI commands we care about. See
  // http://webaudio.github.io/web-midi-api/#a-simple-monophonic-sine-wave-midi-synthesizer.
  const NOTE_ON = 9;
  const NOTE_OFF = 8;
  const CONTROL_CHANGE = 11;
  const CONTROLER_NUMBER = 1;

  const cmd = event.data[0] >> 4;
  let channel = event.data[0] & 0x0f; // Currently ignoring channel
  channel++;
  const pitch = event.data[1];
  const velocity = event.data.length > 2 ? event.data[2] : 1;

  // if (cmd === CONTROL_CHANGE) {
  //   const controllerNumber = event.data[1];
  //   const controllerValue = event.data[2];
  //   console.log(`Control Change: Controller Number: ${controllerNumber}, Value: ${controllerValue}`);
  //   if (controllerNumber === CONTROLER_NUMBER)
  //     socket.emit('switch', controllerValue);
  // } else
  if (cmd === NOTE_OFF || (cmd === NOTE_ON && velocity === 0)) {
    // Note that not all MIDI controllers send a separate NOTE_OFF command for every NOTE_ON.
    // void
    const message = {
      role: 'group',
      channel: channel,
      note: pitch,
      velocity: velocity,
      isNoteOff: true,
    };
    logMessage(message);
    socket.emit('midi_message', message);
    stopPreviewContent(pitch, channel);
  } else if (cmd === NOTE_ON) {
    const message = {
      role: 'group',
      channel: channel,
      note: pitch,
      velocity: velocity,
    };
    socket.emit('midi_message', message);
    // logging
    logMessage(message);
    previewContent(pitch, channel);
  }
}

function logMessage(message) {
  const eventsItem = document.createElement('div');
  const text = `${message.isNoteOff ? 'NOTE OFF' : 'NOTE ON'} (CH${
    message.channel
  } NOTE${message.note} VEL${message.velocity})`;
  eventsItem.textContent = text;
  const groupsContentsEl = groupsEl.querySelector(
    `[data-group-id="${message.channel}"]`,
  );
  groupsContentsEl.querySelector('.content--event').prepend(eventsItem);
}
