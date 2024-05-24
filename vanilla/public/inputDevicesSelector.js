/**
 * @param midiIn {Array<MIDIInput>}
 * @param selected {Array<string>} Name of device
 */
const InputDevicesSelector = function (midiIn, selected) {
  console.log('init Input selector');
  const selectElement = document.getElementById('devices');

  // Function to initialize the first option as selected
  function initializeFirstOptionAsSelected() {
    if (selectElement.options.length > 0) {
      selectElement.options[0].selected = true;
      selected.push(selectElement.options[0].value);
    }
  }

  // Function to handle change events
  function handleSelectChange(event) {
    selected.length = 0; // Clear the array

    for (let option of selectElement.options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
  }

  // Function to add MIDIInput to the select element
  function addMIDIInputToSelect(midiInput) {
    const option = document.createElement('option');
    option.value = midiInput.id;
    option.text = midiInput.name;
    selectElement.appendChild(option);
  }

  // Function to initialize MIDI inputs
  function initializeMIDIInputs() {
    selectElement.innerHTML = '';
    for (let input of midiIn) {
      addMIDIInputToSelect(input);
    }
    // Initialize the first option as selected after adding MIDI inputs
    initializeFirstOptionAsSelected();
  }

  // Attach the change event listener
  selectElement.addEventListener('change', handleSelectChange);

  // Initialize MIDI inputs
  initializeMIDIInputs();

  // Expose selectedDevices for external access if needed
  return {
    getSelected: () => selected,
  };
};
