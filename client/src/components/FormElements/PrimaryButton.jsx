import styled from '@emotion/styled';
import React from 'react';
import { Button } from './Button';

const Container = styled(Button)`
  background-color: var(--secondary);
  transition: all 0.25s;
  color: var(--black);
  &:hover {
    background-color: var(--black-200);
    color: var(--primary);
  }
`;

export const PrimaryButton = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};
