import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GroupMonitorList from '../components/GroupMonitor/GroupMonitorList';
import Header from '../components/Header';
import InputDevicesSelector from '../components/Midi/InputDeviceSelector';
import MIDIConnectionState from '../components/Midi/MidiConnectionState';
import SessionSelector from '../components/SessionSelector';
import SocketConnectionState from '../components/Socket/SocketConnectionState';
import { socket } from '../socket';
import { useMIDIStore } from '../stores/AdvancedMidiStore';
import useMidiStore from '../stores/MidiStore';
import useSessionStore from '../stores/SessionStore';

const Container = styled.div`
  margin-top: 4rem;
`;

export default function Host() {
  const { presetId } = useParams();
  const { groups, preset, loadPreset } = useSessionStore();
  const { connectedMIDIInputs } = useMIDIStore();

  const { setStatus } = useMidiStore();

  function handleMIDIError(e) {
    setStatus('error');
    console.error(e);
  }

  // Sockets
  useEffect(() => {
    socket.on('midimessage', (msg) => console.log(msg));

    return () => {
      socket.off('midimessage', (msg) => console.log(msg));
    };
  }, []);

  useEffect(() => {
    const options = {};
    socket.emit('host', options);
  }, []);

  const stopContent = (note, group) => {
    console.log('stop');
  };

  const playContent = (note, group) => {
    console.log('play');
  };

  useEffect(() => {
    loadPreset(presetId || 'default');
  }, [presetId]);

  return (
    <Container>
      <Header>
        <span>Host</span>
        <div className='spacer'>
          <SessionSelector />
        </div>
        <InputDevicesSelector />
        <MIDIConnectionState />
        <SocketConnectionState />
      </Header>

      {/* <MidiBasic /> */}
      <GroupMonitorList groups={preset?.groups} />
    </Container>
  );
}
