import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';

interface DropdownFieldProps {
  label: string;
  value: string;
  onPress: () => void;
}

const DropdownField = ({ label, value, onPress }: DropdownFieldProps) => {
  const { width } = useWindowDimensions();

  // Responsive adjustments
  const labelFontSize = width > 400 ? 12 : 10;
  const valueFontSize = width > 400 ? 14 : 12;
  const paddingSize = width > 400 ? 12 : 8;
  const arrowSize = width > 400 ? 16 : 12;

  return (
    <TouchableOpacity style={[styles.container, { padding: paddingSize }]} onPress={onPress}>
      <Text style={[styles.label, { fontSize: labelFontSize }]}>{label}</Text>
      <View style={styles.row}>
        <Text style={[styles.value, { fontSize: valueFontSize }]}>{value}</Text>
        <Image
          source={require('../ProfileScreenpics/down-arrow.png')}
          style={{ width: arrowSize, height: arrowSize }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    backgroundColor: '#F4DBFF',
    borderColor: '#6B2A88',
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    color: '#B766DA',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    color: '#4B5563',
  },
});

export default DropdownField;