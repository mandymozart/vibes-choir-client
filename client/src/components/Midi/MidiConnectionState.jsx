// SocketConnectionIndicator.js
import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { SiMidi } from 'react-icons/si';
import useMidiStore from '../../stores/MidiStore';

const Container = styled.div`
  display: flex;
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 0.25rem 0.5rem;
  line-height: 12px;

  .indicator {
    text-align: center;
    display: inline-block;
    width: 1rem;
    border-radius: 1rem;
    height: 1rem;
    margin-left: 0.5rem;
  }
  &.connecting .indicator {
    background-color: yellow;
  }

  &.ready .indicator {
    background-color: green;
  }

  &.disconnected .indicator {
    background-color: grey;
  }

  &.error .indicator {
    background-color: red;
  }
`;

const MIDIConnectionState = () => {
  const { status, midiConnected } = useMidiStore();
  useEffect(() => {
    console.log(status);
  }, [status]);
  return (
    <Container className={status}>
      <SiMidi />
      <div className='indicator'></div>
    </Container>
  );
};

export default MIDIConnectionState;
