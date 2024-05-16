const contentsEl = document.querySelector('.contents')
const imageEl = document.querySelector('#image');
const onomatopoeiaEl = document.querySelector('#onomatopoeia');

function join() {
  role = 'group';
  rootEl.classList.add('group');

  // Subscribe to 'midi_message' event emitted by the server
  socket.on('midi_message', (message) => {
    console.log('Received: ', channel, message.clientId);
    const data = message.data;
    // Play image if subscribed to this group
    if (data.role === 'group' && data.group === channel && !data.isNoteOff) {
      playContent(data.note);
    } else {
      stopContent(data.note)
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

function playContent(note) {
  // Find the content corresponding to the note
  const content = contents.find((img) => img.note === note);
  console.log(note, content)
  if (content) {

    // switch content
    contentsEl.querySelectorAll('.content').forEach(el => el.style.visibility = 'hidden')
    if (content.media.type === 'image') {
      imageEl.querySelector('img').src = content.media.url;
      imageEl.style.visibility = 'visible';
    }
    if (content.media.type === 'onomatopoeia') {
      onomatopoeiaEl.textContent = content.media.text;
      onomatopoeiaEl.style.visibility = 'visible';
    }
  } else {
    console.error('Content not found for MIDI note:', note);
  }
}

function stopContent(note) {
  //make content invisible
  contentsEl.querySelectorAll('.content').forEach(el => el.style.visibility = 'hidden')
}
