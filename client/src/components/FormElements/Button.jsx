import styled from '@emotion/styled';
import clsx from 'clsx';
import React from 'react';

const Container = styled.button`
  border-radius: 2rem;

  border: 1px solid transparent;
  padding: 0 1.5rem;
  font-size: 1rem;
  line-height: 2.5rem;
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
  &.isActive {
  }
  &:disabled {
    color: var(--black-200);
    cursor: not-allowed;
  }
`;

export const Button = ({ children, ...props }) => {
  return (
    <Container
      className={clsx({ isActive: props.isActive })}
      {...props}>
      {children}
    </Container>
  );
};
