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
import useSessionStore from '../stores/SessionStore';

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
`;

export default function Host() {
  const { presetId } = useParams();
  const { preset, loadPreset } = useSessionStore();

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

  useEffect(() => {
    loadPreset(presetId || 'default');
  }, [presetId]);

  return (
    <Container>
      <Header>
        <div className='spacer'>
          <SessionSelector />
        </div>
        <InputDevicesSelector />
        <MIDIConnectionState />
        <SocketConnectionState />
      </Header>
      <GroupMonitorList groups={preset?.groups} />
    </Container>
  );
}
