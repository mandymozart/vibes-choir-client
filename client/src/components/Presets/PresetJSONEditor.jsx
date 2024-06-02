import styled from '@emotion/styled';
import { JsonEditor } from 'json-edit-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TiDownloadOutline, TiTrash, TiUploadOutline } from 'react-icons/ti';
import usePresetsStore from '../../stores/PresetsStore';
import { Button } from '../FormElements/Button';
import { PrimaryButton } from '../FormElements/PrimaryButton';

const Container = styled.div`
  height: calc(100vh - 5rem);
  overflow: scroll;
  .json-editor {
    background-color: var(--white);
  }
  .actions {
    display: flex;
    gap: 1rem;
    position: sticky;
    top: 0;
    margin-bottom: 1rem;
    z-index: 1;
    justify-content: end;
    padding-right: 1rem;
  }
`;

const PresetJSONEditor = ({ preset }) => {
  const [jsonData, setJsonData] = useState(preset);
  const [status, setStatus] = useState('untouched');
  const { presets, selected, updatePreset, setSelected } = usePresetsStore();

  const handleUpdate = ({ newData }) => {
    setJsonData(newData);
    console.log('Updated JSON data:', newData);
  };

  const saveToLocal = () => {
    updatePreset(jsonData);
    setSelected(jsonData);
    toast('updated local storage', { position: 'bottom-center' });
    setStatus('saved-to-local');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          // Assuming jsonData contains the updated preset data
          updatePreset(selectedPreset.id, jsonData);
          setSelected({ ...selectedPreset, ...jsonData });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    console.log(selected);
    setJsonData(selected);
  }, [selected]);
  if (!jsonData) return;
  return (
    <Container>
      <div className='actions'>
        <PrimaryButton>
          Download <TiDownloadOutline />
        </PrimaryButton>
        <PrimaryButton>
          Import <TiUploadOutline />
        </PrimaryButton>
        <PrimaryButton onClick={() => saveToLocal()}>Save</PrimaryButton>
        <Button>
          Delete
          <TiTrash />
        </Button>
      </div>
      <JsonEditor
        data={jsonData}
        onUpdate={handleUpdate}
        theme='githubLight'
        rootName='preset'
        collapse={3}
        className='json-editor'
        showCollectionCount='when-closed'
        enableClipboard='true'
        showStringQuotes='true'

        // You can add other props here if needed
      />
    </Container>
  );
};

export default PresetJSONEditor;
