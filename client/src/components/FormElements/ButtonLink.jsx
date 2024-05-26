import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';

const Container = styled(Link)`
  border-radius: 2rem;

  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--black-200);
  color: var(--white);
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary-500);
  }
  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

export const ButtonLink = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};
