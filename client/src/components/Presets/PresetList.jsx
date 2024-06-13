import styled from '@emotion/styled';
import React from 'react';
import usePresetStore from '../../stores/PresetsStore';
import { PrimaryButton } from '../FormElements/PrimaryButton';
import PresetItem from './PresetItem';
import { GET_PRESETS } from '../../queries/PresetQueries';
import { useQuery } from '@apollo/client';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PresetList = () => {
  // const { presets } = usePresetStore();
  const { loading, error, data } = useQuery(GET_PRESETS);


  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error : {error.message}</p>;
  return (
    <Container>
      {data?.presets?.map((preset, index) => (
        <PresetItem
          preset={preset}
          key={index}
        />
      ))}
    </Container>
  );
};

export default PresetList;
