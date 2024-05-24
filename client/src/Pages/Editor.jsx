import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import PresetEditor from '../components/PresetEditor';

const notes = Array.from({ length: 127 }, (_, i) => i + 1);

const Container = styled.div``;

const Editor = () => {
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [presetDetails, setPresetDetails] = useState({});
  const [formState, setFormState] = useState({
    presetName: '',
    presetId: '',
    note: '',
    mediaType: '',
    text: '',
    url: '',
  });

  useEffect(() => {
    // Initialize with a default preset
    const defaultPreset = { id: '1', name: 'Default Preset', contents: [] };
    setPresets([defaultPreset]);
    setSelectedPresetId(defaultPreset.id);
    setPresetDetails(defaultPreset);
  }, []);

  useEffect(() => {
    const selectedPreset = presets.find(
      (preset) => preset.id === selectedPresetId,
    );
    if (selectedPreset) {
      setPresetDetails(selectedPreset);
      setFormState({
        presetName: selectedPreset.name,
        presetId: selectedPreset.id,
        note: '',
        mediaType: '',
        text: '',
        url: '',
      });
    }
  }, [selectedPresetId, presets]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handlePresetChange = (event) => {
    setSelectedPresetId(event.target.value);
  };

  const handleNoteChange = (event) => {
    const note = parseInt(event.target.value);
    const content = presetDetails.contents.find(
      (content) => content.note === note,
    );
    setSelectedContent(content);
    setFormState({
      ...formState,
      note: note,
      mediaType: content ? content.media.type : '',
      text: content ? content.media.text : '',
      url: content ? content.media.url : '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedPreset = {
      ...presetDetails,
      name: formState.presetName,
      id: formState.presetId,
      contents: [
        ...presetDetails.contents.filter(
          (content) => content.note !== formState.note,
        ),
        {
          note: formState.note,
          media: {
            type: formState.mediaType,
            text: formState.text,
            url: formState.url,
          },
        },
      ],
    };

    setPresets(
      presets.map((preset) =>
        preset.id === updatedPreset.id ? updatedPreset : preset,
      ),
    );
    setPresetDetails(updatedPreset);
  };

  return (
    <Container>
      <h2>Add MIDI Content</h2>
      <form
        id='content-form'
        onSubmit={handleSubmit}>
        <label htmlFor='preset-name'>Preset Name:</label>
        <input
          type='text'
          id='preset-name'
          name='presetName'
          value={formState.presetName}
          onChange={handleInputChange}
        />
        <label htmlFor='preset-id'>Preset ID:</label>
        <input
          type='text'
          id='preset-id'
          name='presetId'
          value={formState.presetId}
          onChange={handleInputChange}
        />
        <label htmlFor='note'>Note:</label>
        <select
          id='note'
          name='note'
          value={formState.note}
          onChange={handleNoteChange}>
          <option value=''>Select Note</option>
          {notes.map((note) => (
            <option
              key={note}
              value={note}>
              {note}{' '}
              {presetDetails.contents &&
              presetDetails.contents.find((content) => content.note === note)
                ? '(filled)'
                : '(empty)'}
            </option>
          ))}
        </select>
        <label htmlFor='media-type'>Media Type:</label>
        <select
          id='media-type'
          name='mediaType'
          value={formState.mediaType}
          onChange={handleInputChange}>
          <option value='onomatopoeia'>👄 Onomatopoeia</option>
          <option value='image'>🖼️ Image</option>
          <option value='score'>♪ Score</option>
          <option value='video'>📹 Video</option>
        </select>
        <label htmlFor='text'>Text:</label>
        <input
          type='text'
          id='text'
          name='text'
          value={formState.text}
          onChange={handleInputChange}
        />
        <label htmlFor='url'>URL:</label>
        <input
          type='text'
          id='url'
          name='url'
          value={formState.url}
          onChange={handleInputChange}
        />
        <button type='submit'>Add Content</button>
      </form>
      <div id='presets-selector'>
        <label htmlFor='presets-select'>Select Preset:</label>
        <select
          id='presets-select'
          value={selectedPresetId}
          onChange={handlePresetChange}>
          {presets.map((preset) => (
            <option
              key={preset.id}
              value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>
      <div id='preset-details'>
        <pre>{JSON.stringify(presetDetails, null, 2)}</pre>
      </div>
      <PresetEditor />{' '}
    </Container>
  );
};

export default Editor;
