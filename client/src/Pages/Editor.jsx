import styled from '@emotion/styled';
import React from 'react';
import Header from '../components/Header';
import PresetJSONEditor from '../components/Presets/PresetJSONEditor';
import PresetList from '../components/Presets/PresetList';

const notes = Array.from({ length: 127 }, (_, i) => i + 1);

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  .content {
    padding: 1rem;
    display: grid;
    position: absolute;
    top: 5rem;
    width: 100%;
    gap: 1rem;
    grid-template-columns: 1fr 4fr;
  }
`;

const Editor = () => {
  return (
    <Container>
      <Header />
      <div className='content'>
        <PresetList />
        <PresetJSONEditor />
      </div>
    </Container>
  );
};

export default Editor;
