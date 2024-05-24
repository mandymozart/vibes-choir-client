import styled from '@emotion/styled';
import clsx from 'clsx';
import React from 'react';
import useSessionStore from '../stores/SessionStore';
import { Button } from './FormElements/Button';
const Container = styled.div`
  position: absolute;
  bottom: 1rem;
  width: 100%;
  text-align: center;
  button:disabled {
    background-color: orange;
  }
  button {
    margin-right: 1rem;
  }
`;

const GroupSwitcher = () => {
  const { groups, switchGroup, currentGroup } = useSessionStore();

  function switcher(group) {
    switchGroup(group.id);
    // socket.emit('switch_group', { id: group.id, channel: group.channel });
  }

  return (
    <Container>
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
