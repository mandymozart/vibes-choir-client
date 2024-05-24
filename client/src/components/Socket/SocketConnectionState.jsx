import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { GoLink, GoUnlink } from 'react-icons/go';
import { io } from 'socket.io-client';
import useSocketStore from '../../stores/SocketStore';

const SOCKET_URI = import.meta.env.VITE_SOCKET_URI;

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
    color: white;
  }

  &.disconnected .indicator {
    background-color: grey;
    color: white;
  }

  &.error .indicator {
    background-color: red;
    color: white;
  }
`;

const SocketConnectionState = () => {
  const { socketConnected, status, setSocketConnected, setStatus } =
    useSocketStore();

  useEffect(() => {
    const socket = io(SOCKET_URI);

    setStatus('connecting');

    socket.on('connect', () => {
      console.log('Connected to server');
      setStatus('ready');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setStatus('disconnected');
      setSocketConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setStatus('error');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setStatus('disconnected');
      setStatus('error');
    });

    socket.on('connect_timeout', () => {
      console.error('Connection timed out');
      setStatus('disconnected');
      setStatus('error');
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [setSocketConnected, setStatus]);

  return (
    <Container className={status}>
      <span>{socketConnected ? <GoLink /> : <GoUnlink />}</span>
      <div className='indicator'></div>
    </Container>
  );
};

export default SocketConnectionState;
