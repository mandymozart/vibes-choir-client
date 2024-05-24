import React from 'react';
import { ContentTypes } from '../../contentTypes';
import { ImagePreview } from './Image';
import { OnomatopoeiaPreview } from './Onomatopoeia';
import { ScorePreview } from './Score';

const ContentPreviews = ({ content, ...props }) => {
  if (!content) return <></>;
  if (content.media.type === ContentTypes.ONOMATOPOEIA)
    return <OnomatopoeiaPreview media={content.media} />;
  if (content.media.type === ContentTypes.IMAGE)
    return <ImagePreview media={content.media} />;
  if (content.media.type === ContentTypes.SCORE)
    return <ScorePreview media={content.media} />;
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

export default ContentPreviews;
