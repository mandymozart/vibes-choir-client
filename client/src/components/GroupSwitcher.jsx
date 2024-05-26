import styled from '@emotion/styled';
import clsx from 'clsx';
import React from 'react';
import useSessionStore from '../stores/SessionStore';
import useUIStore from '../stores/UIStore';
import { Button } from './FormElements/Button';
const Container = styled.div`
  position: absolute;
  bottom: 1rem;
  width: 100%;
  text-align: center;
  transition: all 0.5s ease-out;
  opacity: 1;
  &.isPresenting {
    opacity: 0;
  }
  button:disabled {
    background-color: orange;
  }
  button {
    margin-right: 1rem;
  }
`;

const GroupSwitcher = () => {
  const { groups, switchGroup, currentGroup } = useSessionStore();
  const { isPresenting } = useUIStore();

  function switcher(group) {
    switchGroup(group.id);
    // socket.emit('switch_group', { id: group.id, channel: group.channel });
  }

  return (
    <Container className={clsx({ isPresenting })}>
      {groups
        ?.sort((a, b) => a.channel - b.channel)
        .map((group) => (
          <Button
            key={group.id}
            className={clsx({
              isActive: group.id === currentGroup.id,
            })}
            disabled={group.id === currentGroup.id}
            onClick={() => switcher(group)}>
            {group.name}
          </Button>
        ))}
    </Container>
  );
};

export default GroupSwitcher;
