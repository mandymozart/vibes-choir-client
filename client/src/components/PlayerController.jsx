import React, { useState } from 'react';
import { CiPlay1, CiStop1 } from 'react-icons/ci';
import { Button } from './FormElements/Button';

export default function PlayerController({ player }) {
  const [playing, setPlaying] = useState(false);

  // Play
  const handlePlay = () => {
    console.log('Play clicked');
    if (player.state === 'STOPPED') {
      player.play();
      setPlaying(true);
    } else {
      console.log('Already PLAYING');
    }
  };
  //Stop
  const handleStop = () => {
    console.log('Stop clicked');
    if (player.state === 'PLAYING') {
      player.stop();
      player.cursor.show();
      setPlaying(false);
    } else {
      console.log('Already STOPPED');
    }
  };

  return (
    <div className='controller-bar'>
      <Button
        disabled={playing}
        onClick={handlePlay}
        className='btn'>
        <CiPlay1 />
      </Button>
      <Button
        disabled={!playing}
        onClick={handleStop}
        className='btn'>
        <CiStop1 />
      </Button>
    </div>
  );
}
