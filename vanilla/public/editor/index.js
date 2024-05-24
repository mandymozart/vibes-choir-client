// Define types
const ContentEditor = (function () {
  let contentForm,
    noteSelect,
    saveButton,
    presetsSelect,
    presetNameInput,
    presetIdInput,
    noteInput,
    mediaTypeInput,
    textInput,
    urlInput,
    presetDetailsContainer;

  let {
    getSelected,
    selectPreset,
    addContent,
    getContent,
    getSelectedJSON,
    savePresetsToLocal,
    setId,
    setName,
    getAll,
  } = Presets(true);

  let selectedContent;

  function renderPresetDetails() {
    console.log('hiere');
    presetDetailsContainer.textContent = getSelectedJSON();
    populateNotes();
    presetIdInput.value = getSelected().id;
    presetNameInput.value = getSelected().name;
  }

  function select() {
    selectPreset();
    renderPresetDetails();
  }

  function renderContentDetails() {
    if (selectedContent) {
      Array.from(mediaTypeInput.options).forEach((option) => {
        option.selected = option.value === selectedContent.media.type;
      });
      textInput.value = selectedContent.media.text
        ? selectedContent.media.text
        : '';
      urlInput.value = selectedContent.media.url
        ? selectedContent.media.url
        : '';
    } else {
      // clear
      Array.from(mediaTypeInput.options).forEach((option) => {
        option.selected = false;
      });
      textInput.value = '';
      urlInput.value = '';
      console.log('still empty');
    }
  }

  function selectContent(note) {
    selectedContent = getContent(note);
    renderContentDetails();
  }

  function populateNotes() {
    for (let i = 1; i <= 127; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      let text = i.toString();
      const content = getContent(i);
      if (content)
        text +=
          ' ' +
          getEmojiForMediaType(content.media.type) +
          ' ' +
          (content.media.text ? content.media.text : '') +
          ' ' +
          (content.media.url ? content.media.url : '');
      else text += ' (empty)';
      option.textContent = text;
      noteSelect.appendChild(option);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    contentForm = document.getElementById('content-form');
    noteSelect = document.getElementById('note');
    saveButton = document.getElementById('save-button');
    presetsSelect = document.getElementById('presets-select');
    presetNameInput = document.getElementById('preset-name');
    presetIdInput = document.getElementById('preset-id');
    noteInput = document.getElementById('note');
    mediaTypeInput = document.getElementById('media-type');
    textInput = document.getElementById('text');
    urlInput = document.getElementById('url');
    presetDetailsContainer = document.getElementById('preset-details');

    select(getSelected().id);

    // Populate presets select dropdown
    getAll().forEach((preset) => {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = preset.name;
      if (getSelected().id == preset.id) option.selected = true;
      presetsSelect.appendChild(option);
    });

    presetsSelect.addEventListener('change', function () {
      const selectedPresetId = presetsSelect.value;
      select(selectedPresetId);
    });

    noteSelect.addEventListener('change', function () {
      const selectedNote = parseInt(noteSelect.value);
      selectContent(selectedNote);
    });

    contentForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const presetName = presetNameInput.value;
      const presetId = presetIdInput.value;
      const note = parseInt(noteInput.value);
      const mediaType = mediaTypeInput.value;
      const text = textInput.value;
      const url = urlInput.value;

      // If preset doesn't exist, create a new one
      //   if (!preset) {
      //     preset = { id: presetId, name: presetName, contents: [] };
      //     presets.push(preset);
      //   }

      if (presetName !== getSelected().name && presetName.length > 3)
        setName(presetName);
      if (presetId !== getSelected().id && presetName.length > 3)
        setId(presetId);

      // Create the content
      const content = { note: note, media: { type: mediaType, text, url } };

      addContent(content);
      console.log(getSelected());
      select(getSelected().id);

      // Optionally, clear the form inputs after adding the content
      // contentForm.reset();
    });

    saveButton.addEventListener('click', function () {
      savePresetsToLocal();
    });
  });

  return {};
})();
