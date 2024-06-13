import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { Roles } from '../../roles';
import { socket } from '../../socket';
import { useMIDIStore } from '../../stores/AdvancedMidiStore';
import useContentMonitorStore from '../../stores/ContentMonitorStore';
import useMidiStore from '../../stores/MidiStore';
import useSessionStore from '../../stores/SessionStore';

const Container = styled.div`
  select {
    border: 0;
    border-radius: 1rem;
    font-family: var(--font);
    padding: 0 1rem;
  }
`;

const InputDevicesSelector = () => {
  const { groups } = useSessionStore();
  // const { midiInputs } = useMIDIStore();
  const { 
    midiInputs, 
    addMIDIInput, 
    connectedMIDIInputs, 
    removeMIDIInput, 
    midiOutputs, 
    addMIDIOutput, 
    connectedMIDIOutputs, 
    removeMIDIOutput 
  } = useMIDIStore();
  const { status, setStatus, setMidiConnected } = useMidiStore();
  const { addContent, removeContent } = useContentMonitorStore();

  const handleInputChange = (event) => {
    const inputId = event.target.value;
    console.log(inputId);
    const input = midiInputs.find((i) => i.id === inputId);
    if (connectedMIDIInputs.find((i) => i.id === inputId)) {
      removeMIDIInput(input);
    } else {
      addMIDIInput(input, handleMIDIMessage);
    }
  };

  // function handleMIDIMessage(msg) {
  //   console.log(msg);
  // }

  const getGroupFromChannel = (channel) =>
    groups.find((g) => g.channel === channel);

  const handleMIDIMessage = (msg) => {
    const event = msg.input.event;
    const NOTE_ON = 9;
    const NOTE_OFF = 8;
    const CONTROL_CHANGE = 11;
    const CONTROLER_NUMBER = 1;

    const cmd = event.data[0] >> 4;
    let channel = event.data[0] & 0x0f;
    channel++;
    const group = getGroupFromChannel(channel);
    const pitch = event.data[1];
    const velocity = event.data.length > 2 ? event.data[2] : 1;

    if (cmd === NOTE_OFF || (cmd === NOTE_ON && velocity === 0)) {
      const message = {
        role: Roles.GROUP,
        channel: channel,
        groupId: group.id,
        note: pitch,
        velocity: velocity,
        isNoteOff: true,
      };
      logMessage(message);
      socket.emit('midi_message', message);
      addContent(pitch, channel);
    } else if (cmd === NOTE_ON) {
      const message = {
        role: Roles.GROUP,
        channel: channel,
        groupId: group.id,
        note: pitch,
        velocity: velocity,
      };
      socket.emit('midi_message', message);
      logMessage(message);
      removeContent(pitch, channel);
    }
  };

  const logMessage = (message) => {
    const text = `${message.isNoteOff ? 'NOTE OFF' : 'NOTE ON'} (CH${message.channel
      } NOTE${message.note} VEL${message.velocity})`;
    // console.log(text);
  };

  useEffect(() => {
    console.log('Available Inputs', midiInputs, 'selecting default');
    console.log('Available Output', midiOutputs, 'selecting default');
    if(midiInputs.length > 0) addMIDIInput(midiInputs[0], handleMIDIMessage);
    if(midiOutputs.length > 0 && addMIDIOutput(midiOutputs[0])) console.log(`Connected Output: '${midiOutputs[0].name}'`);
  }, [midiInputs, midiOutputs]);

  useEffect(() => {
    console.log('Connected Inputs', connectedMIDIInputs);
    if (connectedMIDIInputs.length > 0) {
      setMidiConnected(true);
      setStatus('ready');
    } else {
      setMidiConnected(false);
      setStatus('disconnected');
    }
  }, [setStatus, connectedMIDIInputs]);

  return (
    <Container>
      {midiInputs && (
        <select onChange={handleInputChange}>
          {Array.from(midiInputs.values()).map((input) => (
            <option
              selected={connectedMIDIInputs.find((i) => i.id === input.id)}
              key={input.id}
              value={input.id}>
              {input.name}{' '}
              {connectedMIDIInputs.find((i) => i.id === input.id) ? 'x' : ''}
            </option>
          ))}
        </select>
      )}
    </Container>
  );
};

export default InputDevicesSelector;
