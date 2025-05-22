import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

const CheckboxWithLabel = ({
  label,
  checked,
  onToggle,
}: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={[styles.checkbox, { borderColor: '#EABAFF' }]}>
        <View
          style={[
            styles.innerCheckbox,
            { backgroundColor: checked ? '#6B2A88' : '#FFFFFF' },
          ]}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CheckboxWithLabel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  innerCheckbox: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6B2A88',
  },
});
