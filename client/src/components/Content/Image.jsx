import styled from '@emotion/styled';
import React from 'react';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Image = ({ media }) => {
  return (
    <Container>
      <img
        src={`/${media.url}`}
        alt={media.text}
      />
    </Container>
  );
};

const ImagePreviewContainer = styled(Container)`
  position: relative;
  top: auto;
  aspect-ratio: 16 / 9;
  height: auto;
`;

export const ImagePreview = ({ media }) => {
  return (
    <ImagePreviewContainer>
      <img
        src={`/${media.url}`}
        alt={media.text}
      />
    </ImagePreviewContainer>
  );
};

export default Image;
