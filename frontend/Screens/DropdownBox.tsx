import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';

interface DropdownBoxProps {
  label: string;
  value: string;
  onPress: () => void;
}

const DropdownBox = ({ label, value, onPress }: DropdownBoxProps) => {
  const { width } = useWindowDimensions();

  const fontSize = width > 400 ? 16 : 14;
  const height = width > 400 ? 40 : 35;
  const paddingLeft = width > 400 ? 10 : 8;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdown, { height, paddingLeft }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.value, { fontSize }]}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },
  value: {},
});

export default DropdownBox;