import styled from '@emotion/styled';
import React from 'react';
import { ButtonLink } from '../components/FormElements/ButtonLink';
import Header from '../components/Header';

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: calc(100vh - 5rem);
  }
`;

const Home = () => {
  return (
    <Container>
      <menu className='main-menu'>
        <ButtonLink to='/group/cloud9/audience'>JOIN</ButtonLink>
        <ButtonLink to='/host/new/cloud9'>HOST</ButtonLink>
        <ButtonLink to='/editor'>EDITOR</ButtonLink>
      </menu>
      <Header />
    </Container>
  );
};

export default Home;
