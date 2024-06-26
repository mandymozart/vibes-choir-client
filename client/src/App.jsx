import styled from '@emotion/styled'; // updated import to styled instead of react
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Toaster } from 'react-hot-toast';

import clsx from 'clsx';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Editor from './Pages/Editor';
import Session from './Pages/Session';
import Home from './Pages/Home';
import Host from './Pages/Host';
import { MIDIProvider } from './stores/AdvancedMidiStore';
import useUIStore from './stores/UIStore';
import Sessions from './Pages/Sessions';

const Container = styled.div`
  background: var(--black);
  height: 100vh;
  width: 100%;
  transition: background 0.5s ease-out;
  &.isPresenting {
    background: black; /* absolute black for projectors */
  }
`;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path='/'
        element={<Home />}
      />
      <Route
        path='/sessions'
        element={<Sessions />} />
      <Route
        path='/session/:sessionId'
        element={<Session />}
      />
      <Route
        path='/session/:presetId/:groupChannel'
        element={<Session />}
      />
      <Route
        path='/host'
        element={<Host />}
      />
      <Route
        path='/host/:sessionId/:presetId'
        element={
          <MIDIProvider>
            <Host />
          </MIDIProvider>
        }
      />
      <Route
        path='/editor'
        element={<Editor />}
      />
    </>,
  ),
);

function App() {
  const { isPresenting } = useUIStore();

  return (
    <Container className={clsx({ isPresenting })}>
      <RouterProvider router={router} />
      <Toaster />
    </Container>
  );
}

export default App;
