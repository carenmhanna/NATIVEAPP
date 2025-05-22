import React, { useState } from 'react';
import { View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

interface DropdownProps {
  placeholder?: string;
  options: string[];
  setSelected: React.Dispatch<React.SetStateAction<string>>; 
}

const Dropdown: React.FC<DropdownProps> = ({ placeholder = "Select an option", options, setSelected }) => {
  const formattedOptions = options.map((option, index) => ({
    key: (index + 1).toString(),
    value: option,
  }));

  return (
    <View style={{ width: 200, position: 'relative', zIndex: 1 }}>  
      <SelectList
  setSelected={(val: string) => setSelected(val)} 
  data={formattedOptions} 
  placeholder={placeholder}
  inputStyles={{ color: 'white', fontSize: 18, paddingHorizontal: 10 }}
  boxStyles={{
    borderColor: '#6B2A88',
    width: '100%',
    height: 70,
    backgroundColor: '#EABAFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    zIndex: 2, 
  }}
  dropdownStyles={{
    backgroundColor:'#EABAFF', 
    borderColor: '#6B2A88',
    maxHeight: 150,
    width: '100%',
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 100,
    justifyContent:'center',
    alignItems:'center',
  }}
  dropdownTextStyles={{
    color:'white',
    fontSize:18,
  }}
/>

    </View>
  );
};

export default Dropdown;
