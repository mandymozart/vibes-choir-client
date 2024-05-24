import React from 'react';

export function BasicEvents({ events }) {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={index}>{JSON.stringify(event)}</li>
      ))}
    </ul>
  );
}
