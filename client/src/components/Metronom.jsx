import styled from '@emotion/react';
import React from 'react';

const Container = styled.div`
  .lamp {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .lamp:hover {
    filter: drop-shadow(0 0 2em var(--primary) aa);
  }
`;

import React, { useEffect, useRef, useState } from 'react';

const click1 = '//daveceddia.com/freebies/react-metronome/click1.wav';
const click2 = '//daveceddia.com/freebies/react-metronome/click2.wav';

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [count, setCount] = useState(0);
  const [bpm, setBpm] = useState(100);
  const [beatsPerMeasure] = useState(4);

  const click1Ref = useRef(new Audio(click1));
  const click2Ref = useRef(new Audio(click2));
  const timerRef = useRef(null);
  const lastClockTimeRef = useRef(null);
  const clockCountRef = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(playClick, (60 / bpm) * 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, bpm]);

  const handleInputChange = (event) => {
    const newBpm = event.target.value;

    if (isPlaying) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(playClick, (60 / newBpm) * 1000);
      setCount(0);
    }

    setBpm(newBpm);
  };

  const playClick = () => {
    if (count % beatsPerMeasure === 0) {
      click2Ref.current.play();
    } else {
      click1Ref.current.play();
    }

    setCount((prevCount) => (prevCount + 1) % beatsPerMeasure);
  };

  const startStop = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCount(0);
      playClick();
    }
  };

  // Set up MIDI access
  useEffect(() => {
    const onMIDIMessage = (message) => {
      const [status] = message.data;
      if (status === 0xfa) {
        // MIDI Start
        setIsPlaying(true);
        setCount(0);
        playClick();
      } else if (status === 0xfc) {
        // MIDI Stop
        setIsPlaying(false);
      } else if (status === 0xf8) {
        // MIDI Clock
        const currentTime = Date.now();
        if (lastClockTimeRef.current) {
          const deltaTime = currentTime - lastClockTimeRef.current;
          clockCountRef.current += 1;

          if (clockCountRef.current >= 24) {
            const bpm = 60000 / ((deltaTime * 24) / clockCountRef.current);
            setBpm(Math.round(bpm));
            clockCountRef.current = 0;
          }
        }
        lastClockTimeRef.current = currentTime;
      }
    };

    const onMIDISuccess = (midiAccess) => {
      for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = onMIDIMessage;
      }
    };

    const onMIDIFailure = () => {
      console.error('Failed to access MIDI devices.');
    };

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

    return () => {
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then((midiAccess) => {
          for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = null;
          }
        });
      }
    };
  }, []);
  return (
    <Container>
      <div className='bpm-slider'>
        <p>{bpm} BPM</p>
        <input
          type='range'
          min='60'
          max='240'
          value={bpm}
          onChange={handleInputChange}
        />
      </div>
      {/* <button onClick={startStop}>{isPlaying ? 'Stop' : 'Start'}</button> */}
    </Container>
  );
};

export default Metronome;
