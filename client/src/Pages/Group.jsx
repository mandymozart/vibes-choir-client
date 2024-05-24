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

const Container = styled.div``;

export default function Group() {
  const { socketConnected, setClientId, clientId } = useSocketStore();
  const {
    currentGroup,
    groups,
    addGroup,
    switchGroup,
    preset,
    sessionId,
    loadPreset,
    status,
  } = useSessionStore();
  const { userId, userName } = useUserStore();
  const { groupChannel, presetId } = useParams();
  const [content, setContent] = useState();
  const [contentId, setContentId] = useState();

  const playContent = (note) => {
    console.log();

    const content = preset.contents.find((c) => c.note === note) || null;
    console.log('playContent', note, content);
    setContent(content);
    setContentId(`${presetId}-${content.note}-${content.type}`);
  };
  const stopContent = (note) => {
    console.log('stopContent', note);
    setContent(null);
  };

  const toggleContent = (data) => {
    if (data.isNoteOff) {
      stopContent(data.note);
    } else {
      playContent(data.note);
    }
  };

  useEffect(() => {
    function onMidiMessage(message) {
      const data = message.data;
      // Play image if subscribed to this group
      if (data.role !== Roles.GROUP) return;
      if (data.channel === currentGroup.channel) {
        toggleContent(data);
      } else {
        const groupExists = groups?.some(
          (group) => group.channel === data.channel,
        );

        if (!groupExists) {
          const newGroup = {
            id: nanoid(),
            channel: data.channel,
            name: `${data.channel.toString()}`,
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString(),
          };
          addGroup(newGroup);
        }
      }
    }

    socket.on('midi_message', onMidiMessage);

    socket.on('joined_session', (message) => {
      const msg = `Welcome ${userName}! Your clientId for this session is: ${message.data.clientId}`;
      console.log(msg, message.data.cachedMessages);
      setClientId(message.data.clientId);
    });

    return () => {
      socket.off('midi_message', onMidiMessage);
    };
  }, [groups, currentGroup]);

  useEffect(() => {
    if (groupChannel && status === 'loaded') {
      switchGroup(groupChannel);
    }
  }, [status, groupChannel]);

  useEffect(() => {
    loadPreset(presetId || 'default');
  }, [presetId]);

  useEffect(() => {
    socket.emit('join_session', {
      sessionId: sessionId,
      presetId: presetId,
      clientId: clientId,
      userId: userId,
    });
  }, [presetId, clientId, sessionId, userId]);

  return (
    <Container>
      <AnimatePresence mode='popLayout'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0 }}
          key={contentId}>
          <Content content={content} />
        </motion.div>
      </AnimatePresence>
      <GroupSwitcher />
      <Header>
        <SocketConnectionState />
      </Header>
    </Container>
  );
}
