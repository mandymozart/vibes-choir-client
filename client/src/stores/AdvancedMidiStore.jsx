import React, { useEffect } from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';

import { create } from 'zustand';

function translateTypeToStatusByte(type) {
  switch (type) {
    case 'noteOff':
      return 0x80;
    case 'noteOn':
      return 0x90;
    case 'afterTouch':
      return 0xa0;
    case 'cc':
      return 0xb0;
    case 'controlChange':
      return 0xb0;
    case 'programChange':
      return 0xc0;
    case 'channelPressure':
      return 0xd0;
    case 'pitchWheel':
      return 0xe0;
    default:
      return 0x00;
  }
}

function sendMIDIMessage({
  channel,
  cc,
  value,
  pitch,
  device,
  type = 'cc',
  log,
}) {
  const firstStatusByte = translateTypeToStatusByte(type);
  const statusBytes = firstStatusByte + (channel ?? 0);
  const msg = [statusBytes, pitch || cc || 0, value || 0];
  if (device) {
    try {
      device.send(msg);
    } catch (error) {
      if (log) console.warn(error);
      return 'An error occurred.';
    }
    return `MIDI message successfully sent: ${msg}`;
  }
  return 'No device specified';
}

function onMIDIMessage(event) {
  let str = '';
  for (let i = 0; i < event.data.length; i += 1) {
    str += `0x${event.data[i].toString(16)} `;
  }
  return {
    data: event.data,
    timeStamp: event.timeStamp,
    str,
    event: event,
  };
}

async function openMIDIInput({ input, callback }) {
  if (typeof input !== 'object') return new Error('No input supplied');
  if (input.connection === 'open' && !callback) return input;
  input.onmidimessage = (msg) => onMIDIMessage(msg);
  if (typeof callback === 'function') {
    const cb = (msg) => {
      const message = onMIDIMessage(msg);
      const stateObj = { relVal: 'mostRecentMessage', input: message };
      callback(stateObj);
    };
    input.onmidimessage = (msg) => cb(msg);
  }
  await input.open();
  return input;
}

async function closeMIDIInput(input) {
  await input.close();
  return input;
}

export const useMIDIStore = create((set, get) => ({
  byDevice: {},
  byChannel: {},
  midiAccess: null,
  midiInputs: [],
  midiOutputs: [],
  connectedMIDIInputs: [],
  connectedMIDIOutputs: [],
  setMIDIValue: (value) => {
    const { channel, cc, value: ccValue, device } = value;
    const state = get();
    set({
      byChannel: {
        ...state.byChannel,
        [channel]: {
          ...state.byChannel[channel],
          [cc]: ccValue,
        },
      },
      byDevice: {
        ...state.byDevice,
        [device.id]: {
          ...state.byDevice[device.id],
          [channel]: {
            ...state.byDevice[device.id]?.[channel],
            [cc]: ccValue,
          },
        },
      },
    });
  },
  initializeMIDI: async (onError) => {
    try {
      if (!('requestMIDIAccess' in navigator))
        throw new Error('MIDI is not supported in this browser.');
      const midiAccess = await navigator.requestMIDIAccess();
      console.log('initializing');
      set({
        midiAccess,
        midiInputs: Array.from(midiAccess.inputs.values()),
        midiOutputs: Array.from(midiAccess.outputs.values()),
      });
    } catch (error) {
      onError(error);
    }
  },
  addMIDIInput: async (input, callback) => {
    try {
      const result = await openMIDIInput({ input, callback });
      set((state) => ({
        connectedMIDIInputs: [...state.connectedMIDIInputs, input],
      }));
      return true;
    } catch (error) {
      return false;
    }
  },
  removeMIDIInput: (input) => {
    try {
      closeMIDIInput(input);
      set((state) => ({
        connectedMIDIInputs: state.connectedMIDIInputs.filter(
          (item) => item.id !== input.id,
        ),
      }));
      return true;
    } catch (error) {
      return false;
    }
  },
  addMIDIOutput: (output) => {
    try {
      set((state) => ({
        connectedMIDIOutputs: [...state.connectedMIDIOutputs, output],
      }));
      return true;
    } catch (error) {
      return false;
    }
  },
  removeMIDIOutput: (output) => {
    try {
      set((state) => ({
        connectedMIDIOutputs: state.connectedMIDIOutputs.filter(
          (item) => item.id !== output.id,
        ),
      }));
      return true;
    } catch (error) {
      return false;
    }
  },
  sendMIDICC: ({ channel, cc, value, device }) => {
    sendMIDIMessage({ channel, cc, value, device, type: 'cc' });
    get().setMIDIValue({ channel, cc, value, device });
  },
  sendMIDINoteOn: ({ channel, pitch, value, velocity, device }) => {
    sendMIDIMessage({
      channel,
      pitch,
      value: value ?? velocity,
      device,
      type: 'noteOn',
    });
  },
  sendMIDINoteOff: ({ channel, pitch, device }) => {
    sendMIDIMessage({ channel, pitch, value: 0, device, type: 'noteOff' });
  },
}));

export function MIDIProvider({ children, onError }) {
  const initializeMIDI = useMIDIStore((state) => state.initializeMIDI);
  const handleError = (error) => {
    console.log('Error initializing MIDI',error)
  }
  useEffect(() => {
    initializeMIDI(handleError);
  }, [initializeMIDI, handleError]);

  return <>{children}</>;
}

export function useMIDIContext(selector) {
  return useMIDIStore(selector);
}

export function useMIDI(props) {
  const sendMIDIMessage = useMIDIStore((state) => state.sendMIDIMessage);
  if (props?.channel !== undefined && props?.cc !== undefined) {
    const send = (value) =>
      sendMIDIMessage({
        channel: props.channel,
        cc: props.cc,
        value,
        device: props.device,
        type: 'cc',
      });
    return send;
  }
  return sendMIDIMessage;
}

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('MIDIStore', useMIDIStore);
}
