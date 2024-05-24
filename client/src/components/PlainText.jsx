import React from 'react';

const PlainText = ({ children }) => {
  return children.split('\n').map((part, index) => (
    <React.Fragment key={index}>
      {part}
      <br />
    </React.Fragment>
  ));
};

export default PlainText;
