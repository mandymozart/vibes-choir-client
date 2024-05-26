import styled from '@emotion/styled';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import OsmdPlayer from 'osmd-audio-player';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import PlainText from '../PlainText';
import PlayerController from '../PlayerController';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  font-family: var(--font-onomatopoeia);
  background: var(--white)
  overflow-wrap: anywhere;
  word-break: break-all;
  top: 0;
  > div {
    padding: 1rem;
  }

  .annotation {
    position: absolute;
    bottom: 3rem;
    padding: 2rem;
    font-size: 1rem;
    font-family: var(--font-onomatopoeia);
    color: var(--black);
    overflow-wrap: anywhere;
    text-align: left;
    word-break: break-all;
  }
`;

const Score = ({ media }) => {
  const refContainer = useRef();
  const osmdRef = useRef();
  const [player] = useState(new OsmdPlayer());

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // OSMD: a couple of useful options...
    const OSMDoptions = {
      autoResize: true,
      followCursor: true,
      disableCursor: false,
      drawComposer: false,
      drawCredits: false,
      measureNumberInterval: 1,
      drawingParameters: 'compacttight',
      drawMetronomeMarks: true,
      //renderSingleHorizontalStaffline: true,
    };

    // OSMD: loading...
    if (!osmdRef.current)
      osmdRef.current = new OSMD(refContainer.current, OSMDoptions);

    osmdRef.current
      .load(`/${media.url}`)
      .then(() => {
        osmdRef.current.render();
        osmdRef.current.cursor.show();
        setLoaded(true);
      })
      .then(() => {
        player.loadScore(osmdRef.current);
      })
      .catch((e) => {
        console.error('OSMD loading ERROR occured...', e);
        toast('Score could not be found! Improvise!');
      });
  }, [media, player, osmdRef]);

  return (
    <Container>
      {loaded && <PlayerController player={player} />}
      <div className='score-inner'>
        <div ref={refContainer}></div>
      </div>
      <div className='annotation'>
        <PlainText>{media.text}</PlainText>
      </div>
    </Container>
  );
};

const ScorePreviewContainer = styled(Container)`
  position: relative;
  top: auto;
  aspect-ratio: 16 / 9;
  height: auto;
  .annotation {
    display: none;
  }
  .inner-score > div {
    aspect-ratio: 16/9;
  }
`;

export const ScorePreview = ({ media }) => {
  const refContainer = useRef();
  const osmdRef = useRef();

  useEffect(() => {
    // OSMD: a couple of useful options...
    const OSMDoptions = {
      autoResize: true,
      followCursor: false,
      disableCursor: true,
      drawComposer: false,
      drawCredits: false,
      measureNumberInterval: 1,
      drawingParameters: 'compacttight',
      drawMetronomeMarks: false,
      //renderSingleHorizontalStaffline: true,
    };

    // OSMD: loading...
    if (!osmdRef.current)
      osmdRef.current = new OSMD(refContainer.current, OSMDoptions);

    osmdRef.current
      .load(`/${media.url}`)
      .then(() => {
        osmdRef.current.render();
      })
      .catch((e) => {
        console.error('OSMD loading ERROR occured...', e);
      });
  }, [media, osmdRef]);

  return (
    <ScorePreviewContainer>
      <div className='score-inner'>
        <div ref={refContainer}></div>
      </div>
    </ScorePreviewContainer>
  );
};

export default Score;
