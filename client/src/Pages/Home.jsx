import styled from '@emotion/styled';
import React from 'react';
import { ButtonLink } from '../components/FormElements/ButtonLink';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 100vh;
`;

const Home = () => {
  return (
    <Container>
      <ButtonLink to='/group/cloud9/audience'>JOIN</ButtonLink>
      <ButtonLink to='/host/new/cloud9'>HOST</ButtonLink>
      <ButtonLink to='/editor'>EDITOR</ButtonLink>
    </Container>
  );
};

export default Home;
