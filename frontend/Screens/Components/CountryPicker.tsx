import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, useWindowDimensions } from 'react-native';

interface CountryPickerProps {
  label: string;
  value: string;
  flag: any; // image
  onPress: () => void;
  onChangeText: (text: string) => void;
}

const CountryPicker = ({ label, value, flag, onPress, onChangeText }: CountryPickerProps) => {
  const { width } = useWindowDimensions();

  // Responsive adjustments
  const labelFontSize = width > 400 ? 12 : 10;
  const inputFontSize = width > 400 ? 14 : 12;
  const flagWidth = width > 400 ? 32 : 24;
  const flagHeight = (flagWidth * 20) / 32; // keep aspect ratio

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize: labelFontSize }]}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={onPress} style={styles.flagContainer}>
          <Image source={flag} style={{ width: flagWidth, height: flagHeight, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { fontSize: inputFontSize }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder=""
        />
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4DBFF',
    borderColor: '#6B2A88',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  flagContainer: {
    paddingRight: 10,
  },
  input: {
    flex: 1,
    color: '#4B5563',
    paddingVertical: 10,
  },
});

export default CountryPicker;