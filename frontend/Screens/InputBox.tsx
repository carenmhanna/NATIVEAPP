// /components/InputBox.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputBoxProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  prefix?: string;
}

const InputBox = ({ label, value, onChangeText, multiline = false, prefix }: InputBoxProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={multiline ? 'default' : 'email-address'}
      />
      {prefix && <Text style={styles.prefix}>{prefix}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  textArea: {
    height: 100,
  },
  prefix: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 16,
  },
});

export default InputBox;