import React from 'react';
import { ContentTypes } from '../../contentTypes';
import Image from './Image';
import Onomatopoeia from './Onomatopoeia';
import Score from './Score';

const Content = ({ content, ...props }) => {
  if (!content) return <></>;
  if (content.media.type === ContentTypes.ONOMATOPOEIA)
    return <Onomatopoeia media={content.media} />;
  if (content.media.type === ContentTypes.IMAGE)
    return <Image media={content.media} />;
  if (content.media.type === ContentTypes.SCORE)
    return <Score media={content.media} />;
  if (content.media.type === ContentTypes.VIDEO)
    return <Video media={content.media} />;

  return (
    <>
      Unknown type '{content.type}' of media at content note {content.note}
      {content.media.url}
      {content.media.text}
      {content.media.url}
    </>
  );
};

const Video = ({ media }) => {
  return (
    <video>
      <source src={`/${media.url}`} />
    </video>
  );
};

export default Content;
