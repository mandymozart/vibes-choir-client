import styled from '@emotion/styled';
import React from 'react';
import { Button } from './Button';

const Container = styled(Button)`
  background-color: orange;
`;

export const PrimaryButton = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};
