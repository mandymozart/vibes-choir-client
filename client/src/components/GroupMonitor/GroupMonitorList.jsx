import styled from '@emotion/styled';
import React from 'react';
import GroupMonitorItem from './GroupMonitorItem';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
  padding: 1rem;
  gap: 1rem;
`;

const GroupMonitorList = ({ groups }) => {
  return (
    <Container>
      {groups?.map((group, index) => (
        <GroupMonitorItem
          group={group}
          key={index}
        />
      ))}
    </Container>
  );
};

export default GroupMonitorList;
