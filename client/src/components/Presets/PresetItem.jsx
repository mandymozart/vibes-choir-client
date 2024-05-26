import styled from '@emotion/styled';
import clsx from 'clsx';
import React from 'react';
import usePresetsStore from '../../stores/PresetsStore';
import { Button } from '../FormElements/Button';

const PresetItemButton = styled(Button)`
  line-height: 1rem;
`;
const Container = styled.div`
  button {
    border-radius: 2rem;
    display: flex;
    line-height: 2.5rem;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    justify-content: space-between;
  }
`;

const PresetItem = ({ preset }) => {
  const { selected, setSelected } = usePresetsStore();
  return (
    <Container className={clsx({ isSelected: selected.id === preset.id })}>
      <PresetItemButton
        isActive={selected.id === preset.id}
        onClick={() => setSelected(preset)}>
        <span>{preset.name}</span>
      </PresetItemButton>
    </Container>
  );
};

export default PresetItem;
