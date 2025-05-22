import React from 'react';
import { View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

interface DropdownProps {
  placeholder?: string;
  options: { key: string; value: string }[];
  setSelected: (val: string) => void;  // <-- expects value, not key
  selected?: string;
}

const Dropdownlong: React.FC<DropdownProps> = ({
  placeholder = "Select an option",
  options,
  setSelected,
  selected,
}) => {
  const defaultOption = selected
    ? options.find(option => option.value === selected)
    : undefined;

  return (
    <View style={{ width: 200, position: 'relative', zIndex: 1 }}>
      <SelectList
        setSelected={(key: string) => {
          const selectedOption = options.find(option => option.key === key);
          if (selectedOption) {
            setSelected(selectedOption.value);
          }
        }}
        data={options}
        placeholder={placeholder}
        defaultOption={defaultOption}
        boxStyles={{
          borderColor: '#6B2A88',
          width: '100%',
          height: 50,
          backgroundColor: '#EABAFF',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        inputStyles={{
          color: 'black',
          fontSize: 16,
          paddingLeft: 10,
        }}
      />
    </View>
  );
};

export default Dropdownlong;
