const contentsEl = document.querySelector('.contents');
const imageEl = document.querySelector('#image');
const onomatopoeiaEl = document.querySelector('#onomatopoeia');
const scoreEl = document.querySelector('#score');
const osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay('osmd');

function join() {
  role = 'group';
  rootEl.classList.add('group');

  // Subscribe to 'midi_message' event emitted by the server
  socket.on('midi_message', (message) => {
    const data = message.data;
    // Play image if subscribed to this group
    if (data.role === 'group' && data.channel === group && !data.isNoteOff) {
      playContent(data.note);
    } else {
      stopContent(data.note);
    }
  });

  socket.on('hello', (message) => {
    console.log('Welcome! Your clientId is:', message.clientId);
    clientId = message.clientId;
  });
}

function switchGroup(index) {
  stopContent();
  rootEl.classList.remove('group--' + group);
  group = index;
  rootEl.classList.add('group--' + index);
  socket.emit('switch', group);
}

function renderScore(content) {
  osmd.setOptions({
    backend: 'svg',
    drawTitle: false,
    drawingParameters: 'compacttight', // don't display title, composer etc., smaller margins
  });
  osmd.load(content.media.url).then(function () {
    osmd.render();
  });
}

function playContent(note) {
  // Find the content corresponding to the note

  const content = getContent(note);
  console.log('content', content);
  if (content) {
    // switch content
    contentsEl
      .querySelectorAll('.content')
      .forEach((el) => (el.style.visibility = 'hidden'));
    if (content.media.type === 'image') {
      imageEl.querySelector('img').src = content.media.url;
      imageEl.style.visibility = 'visible';
    }
    if (content.media.type === 'onomatopoeia') {
      onomatopoeiaEl.textContent = content.media.text;
      onomatopoeiaEl.style.visibility = 'visible';
    }
    if (content.media.type === 'score') {
      scoreEl.querySelector('.annotation').innerHTML =
        content.media.text.replace(/\n/g, '<br/>');
      scoreEl.style.visibility = 'visible';
      renderScore(content);
    }
  } else {
    console.error('Content not found for MIDI note:', note);
  }
}

function stopContent(note) {
  //make content invisible
  contentsEl
    .querySelectorAll('.content')
    .forEach((el) => (el.style.visibility = 'hidden'));
}
