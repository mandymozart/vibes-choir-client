import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TiCog } from 'react-icons/ti';
import useContentMonitorStore from '../../stores/ContentMonitorStore';
import useSessionStore from '../../stores/SessionStore';
import ContentPreviews from '../Content/ContentPreviews';
import { Button } from '../FormElements/Button';

const Container = styled.div`
  button {
    border-radius: 1rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    background: #313131;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    justify-content: space-between;
  }
`;

const GroupMonitorItem = ({ group }) => {
  const { contents } = useContentMonitorStore();
  const { preset, presetId } = useSessionStore();
  const [content, setContent] = useState();
  const [contentId, setContentId] = useState();

  const playContent = (note) => {
    const newContent = preset.contents.find((c) => c.note === note) || null;
    if (!newContent) {
      toast(`${presetId} Note ${note} is not defined!`, {
        position: 'bottom-center',
      });
      return;
    }
    // console.log('playContent', note, newContent);
    setContent(newContent);
    setContentId(`${presetId}-${newContent.note}-${newContent.type}`);
  };
  const stopContent = () => {
    // console.log('stopContent');
    setContent(null);
  };
  useEffect(() => {
    // console.log(contents[group.channel]);
    // if (group.channel === 5) console.log(contents[5]);
    if (contents[group.channel]) {
      playContent(contents[group.channel]);
    } else {
      stopContent();
    }
  }, [contents]);

  const editGroup = (group) => {
    console.log('edit group', group);
  };
  return (
    <Container>
      <Button onClick={() => editGroup(group)}>
        <span>{group.channel}</span> <span>{group.name}</span> <TiCog />
      </Button>

      <AnimatePresence mode='popLayout'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0 }}
          key={contentId}>
          <ContentPreviews content={content} />
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default GroupMonitorItem;
