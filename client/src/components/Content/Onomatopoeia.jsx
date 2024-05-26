import styled from '@emotion/styled';
import React from 'react';

const Container = styled.div`
  font-size: 15vh;
  line-height: 15vh;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
  display: flex;
  align-items: center;
  font-family: var(--font-onomatopoeia);
  color: var(--white)
  overflow-wrap: anywhere;
  text-align: center;
  word-break: break-all;
  div {
    padding: 2rem;
  }
`;

const Onomatopoeia = ({ media }) => {
  return (
    <Container>
      <div>{media.text}</div>
    </Container>
  );
};

const OnomatopoeiaPreviewContainer = styled(Container)`
  position: relative;
  top: auto;
  font-size: 1rem;
  line-height: 1rem;
  aspect-ratio: 16 / 9;
  height: auto;
  div {
    padding: 1rem;
  }
`;

export const OnomatopoeiaPreview = ({ media }) => {
  return (
    <OnomatopoeiaPreviewContainer>
      <div>{media.text}</div>
    </OnomatopoeiaPreviewContainer>
  );
};

export default Onomatopoeia;
