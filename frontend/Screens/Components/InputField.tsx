import React from 'react';
import { View, Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
}

const InputField = ({ label, value, onChangeText, editable = true }: InputFieldProps) => {
  const { width } = useWindowDimensions();

  // Dynamic sizing based on screen width
  const labelFontSize = width > 400 ? 12 : 10;
  const inputFontSize = width > 400 ? 14 : 12;
  const inputPadding = width > 400 ? 12 : 8;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize: labelFontSize }]}>{label}</Text>
      <TextInput
        style={[styles.input, { fontSize: inputFontSize, padding: inputPadding }]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder=""
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    color: '#B766DA',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F4DBFF',
    borderColor: '#6B2A88',
    borderWidth: 1,
    borderRadius: 8,
    color: '#4B5563',
  },
});

export default InputField;