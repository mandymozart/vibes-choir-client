import styled from '@emotion/styled'; // updated import to styled instead of react
import React from 'react';
import { Toaster } from 'react-hot-toast';

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Editor from './Pages/Editor';
import Group from './Pages/Group';
import Home from './Pages/Home';
import Host from './Pages/Host';
import { MIDIProvider } from './stores/AdvancedMidiStore';

const Container = styled.div``;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path='/'
        element={<Home />}
      />
      <Route
        path='/group'
        element={<Group />}
      />
      <Route
        path='/group/:presetId/:groupChannel'
        element={<Group />}
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
  return (
    <Container>
      <RouterProvider router={router} />
      <Toaster />
    </Container>
  );
}

export default App;
