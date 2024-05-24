import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Button } from './FormElements/Button';

const Container = styled.header`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .spacer {
    flex: 1;
  }
`;

const Header = ({ children }) => {
  const [hidden, setHidden] = useState();
  return (
    <Container>
      <Button onClick={() => setHidden(!hidden)}></Button>
      {children}
    </Container>
  );
};

export default Header;
