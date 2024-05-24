import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import usePresetsStore from '../stores/PresetsStore'; // Import the Zustand store
import { PrimaryButton } from './FormElements/PrimaryButton';

const Container = styled.div``;

const PresetEditor = ({ children }) => {
  const [selectedPreset, setSelectedPreset] = useState({});
  const [noteOptions, setNoteOptions] = useState([]);

  const {
    getAll,
    selectPreset,
    getContent,
    addContent,
    setName,
    setId,
    savePresetsToLocal,
  } = usePresetsStore();

  useEffect(() => {
    // On component mount
    const presets = getAll();
    setSelectedPreset(presets[0]); // Select the first preset by default
    // Populate presets select dropdown
    setNoteOptions(
      [...Array(127)].map((_, i) => ({
        value: (i + 1).toString(),
        text: (i + 1).toString(),
      })),
    );
  }, []); // Run only on component mount

  const handlePresetChange = (event) => {
    const selectedPresetId = event.target.value;
    selectPreset(selectedPresetId);
    setSelectedPreset(
      getAll().find((preset) => preset.id === selectedPresetId),
    );
  };

  const handleNoteChange = (event) => {
    const selectedNote = parseInt(event.target.value);
    const selectedContent = getContent(selectedNote);
    setSelectedPreset({ ...selectedPreset, selectedContent });
  };

  const handleSave = () => {
    savePresetsToLocal();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const presetName = formData.get('preset-name');
    const presetId = formData.get('preset-id');
    const note = parseInt(formData.get('note'));
    const mediaType = formData.get('media-type');
    const text = formData.get('text');
    const url = formData.get('url');

    if (presetName !== selectedPreset.name && presetName.length > 3)
      setName(presetName);
    if (presetId !== selectedPreset.id && presetName.length > 3)
      setId(presetId);

    // Create the content
    const content = { note: note, media: { type: mediaType, text, url } };

    addContent(content);
    setSelectedPreset(getAll().find((preset) => preset.id === presetId));
  };

  return (
    <Container>
      <form
        id='content-form'
        onSubmit={handleFormSubmit}>
        <select
          id='note'
          onChange={handleNoteChange}>
          {noteOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <PrimaryButton
          id='save-button'
          type='button'
          onClick={handleSave}>
          Save
        </PrimaryButton>
      </form>
      <select
        id='presets-select'
        onChange={handlePresetChange}>
        {getAll().map((preset) => (
          <option
            key={preset.id}
            value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>
      <div id='preset-details'>{JSON.stringify(selectedPreset)}</div>
    </Container>
  );
};

export default PresetEditor;
