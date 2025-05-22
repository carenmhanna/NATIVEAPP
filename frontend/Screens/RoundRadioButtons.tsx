import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  activeColor?: string;
  inactiveColor?: string;
};

const RoundRadioButtons = ({
  options,
  selectedOption,
  onSelect,
  activeColor = '#7B1FA2',
  inactiveColor = '#E1BEE7',
}: Props) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const selected = selectedOption === option; // Check if this option is selected

        return (
          <TouchableOpacity
            key={option}  // Key should be the option value
            style={[
              styles.optionContainer,
              index < options.length - 1 && { marginRight: 60 }, // Space between options
            ]}
            onPress={() => onSelect(option)} // Call onSelect with the selected option
          >
            <View
              style={[
                styles.radioOuter,
                {
                  borderColor: activeColor, // Border color when not selected
                  backgroundColor: selected ? inactiveColor : 'transparent', // Background color when selected
                },
              ]}
            >
              {selected && (
                <View
                  style={[styles.radioInner, { backgroundColor: activeColor }]} // Inner circle when selected
                />
              )}
            </View>
            <Text style={[styles.label, { color: activeColor }]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RoundRadioButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
