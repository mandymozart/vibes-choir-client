import styled from '@emotion/styled';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { AiOutlineFullscreen } from 'react-icons/ai';
import useUIStore from '../stores/UIStore';
import { Button } from './FormElements/Button';
import LogoButton from './LogoButton';

const Container = styled.header`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* transform: translate(0); */
  transition: opacity 0.5s ease-out;
  &.isPresenting {
    opacity: 0;
  }
  .content {
    transition: all 0.5s ease-out;
    opacity: 1;
    display: flex;
    gap: 1rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .spacer {
    flex: 1;
  }
`;

const HeaderButton = styled(Button)`
  line-height: 1rem;
  background: transparent;
  border: 0;
  padding: 0;
  &:focus {
    border: 0;
    outline: none;
  }
  svg {
    height: 1.5rem;
    width: 1.5rem;
    display: block;
  }
`;

const Header = ({ children }) => {
  const { isPresenting, setIsPresenting } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPresenting(false);
      }

      if (event.key === 'f') {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        console.log('Exited fullscreen mode');
        setIsPresenting(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setIsPresenting(true);
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsPresenting(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
          );
        });
      // toast('Use ESC to exit fullscreen');
    } else {
      document.exitFullscreen();
      setIsPresenting(false);
    }
  };
  return (
    <Container className={clsx({ isPresenting: isPresenting })}>
      <LogoButton />
      <div className='spacer'></div>
      <div className='content'>{children}</div>
      <HeaderButton onClick={() => toggleFullScreen()}>
        <AiOutlineFullscreen />
      </HeaderButton>
    </Container>
  );
};

export default Header;
