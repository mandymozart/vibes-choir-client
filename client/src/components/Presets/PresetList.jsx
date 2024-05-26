import styled from '@emotion/styled';
import React from 'react';
import usePresetStore from '../../stores/PresetsStore';
import { PrimaryButton } from '../FormElements/PrimaryButton';
import PresetItem from './PresetItem';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PresetList = () => {
  const { presets } = usePresetStore();
  const addNew = () => {
    console.log('todo');
  };
  return (
    <Container>
      {presets?.map((preset, index) => (
        <PresetItem
          preset={preset}
          key={index}
        />
      ))}
      <PrimaryButton onClick={addNew}>Add new</PrimaryButton>
    </Container>
  );
};

export default PresetList;
