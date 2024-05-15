let midiIn = [],
    midiOut = [];

const devicesListEl = document.querySelector('#devices');
const eventsListEl = document.querySelector('#events');
const groupsEl = document.querySelector('.groups');


if (!isMobileDevice()) rootEl.classList.add('can-host')

function previewContent(note, _group) {
    // Find the content corresponding to the note
    const content = contents.find((img) => img.note === note);
    console.log(note, content)
    if (content) {

        // switch content
        const groupsContentsEl = groupsEl.querySelector(`[data-group-id="${_group}"]`);
        console.log(groupsContentsEl)
        groupsContentsEl.querySelectorAll('.content').forEach(el => el.style.display = 'none')
        if (content.media.type === 'image') {
            groupsContentsEl.querySelector('.content--image img').src = content.media.url;
            groupsContentsEl.querySelector('.content--image').style.display = 'block';
        }
        if (content.media.type === 'onomatopoeia') {
            groupsContentsEl.querySelector('.content--onomatopoeia').textContent = content.media.text;
            groupsContentsEl.querySelector('.content--onomatopoeia').style.display = 'flex';
        }
    } else {
        console.error('Content not found for MIDI note:', note);
    }
}

function stopPreviewContent(note, _group) {
    //make content invisible
    contentsEl.querySelectorAll('.content').forEach(el => el.style.visibility = 'hidden')
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
    // MIDI commands we care about. See
    // http://webaudio.github.io/web-midi-api/#a-simple-monophonic-sine-wave-midi-synthesizer.
    const NOTE_ON = 9;
    const NOTE_OFF = 8;
    const CONTROL_CHANGE = 11;
    const CONTROLER_NUMBER = 1;

    const cmd = event.data[0] >> 4;
    const channel = event.data[0] & 0x0F; // Currently ignoring channel
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
        console.log(
            `🎧 OFF CH${channel} NOTE${pitch} VEL${velocity}`,
        );
        stopPreviewContent(pitch, velocity-1);
    } else if (cmd === NOTE_ON) {
        console.log(
            `🎧 CH${channel} NOTE${pitch} VEL${velocity}`,
        );
        socket.emit('midi_message', { role: 'group', channel: channel, note: pitch, group: velocity - 1 }); // velocity starts from 1 but we need indexing from 0

        const eventsItem = document.createElement('div');
        eventsItem.textContent = `CH${channel} NOTE${pitch} VEL${velocity}=group`;
        eventsListEl.innerHTML = '';
        eventsListEl.append(eventsItem);
        previewContent(pitch, velocity-1);
    }
}