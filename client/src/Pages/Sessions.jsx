import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Content from '../components/Content/Content';
import GroupSwitcher from '../components/GroupSwitcher';
import Header from '../components/Header';
import SocketConnectionState from '../components/Socket/SocketConnectionState';
import { Roles } from '../roles';
import { socket } from '../socket';
import useSessionStore from '../stores/SessionStore';
import useSocketStore from '../stores/SocketStore';
import useUserStore from '../stores/UserStore';

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
`;

export default function Sessions() {

  return (
    <Container>
      <Header>
Choose Session
      </Header>
    </Container>
  );
}
