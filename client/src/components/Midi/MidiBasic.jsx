import React, { useEffect } from 'react';
import useMidiStore from '../../stores/MidiStore';

const MidiBasic = () => {
  const {
    midiAccess,
    midiMessages,
    setMidiAccess,
    addMidiMessage,
    selectedInput,
    setSelectedInput,
  } = useMidiStore();

  useEffect(() => {
    // Check for MIDI support
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log('Web MIDI API is not supported in this browser.');
    }

    // Cleanup function to remove event listeners
    return () => {
      if (midiAccess) {
        for (let input of midiAccess.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, [midiAccess]);

  const onMIDISuccess = (access) => {
    setMidiAccess(access);
    for (let input of access.inputs.values()) {
      input.onmidimessage = handleMIDIMessage;
    }
  };

  const onMIDIFailure = () => {
    console.log('Could not access your MIDI devices.');
  };

  const handleMIDIMessage = (message) => {
    const [command, note, velocity] = message.data;
    console.log(
      `MIDI message received: command=${command}, note=${note}, velocity=${velocity}`,
    );

    addMidiMessage({ command, note, velocity });
  };

  return (
    <div>
      <h1>MIDI Messages</h1>
      <ul>
        {midiMessages.map((msg, index) => (
          <li key={index}>
            Command: {msg.command}, Note: {msg.note}, Velocity: {msg.velocity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MidiBasic;
