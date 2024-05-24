import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSessionStore from '../stores/SessionStore';

const Container = styled.div``;

const SessionSelector = () => {
  const { sessionId } = useParams();
  const { setSessionId } = useSessionStore();
  useEffect(() => {
    if (sessionId) setSessionId(sessionId);
    else setSessionId('new');
  }, [sessionId]);
  return <Container>Session:{sessionId}</Container>;
};

export default SessionSelector;
