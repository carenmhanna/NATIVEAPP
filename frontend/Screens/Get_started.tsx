import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';

interface NextProps {
  period?: string;
  frequency?: string;
  selectedOptions?:string[];
}

const Get_started: React.FC<NextProps> = ({ period,frequency,selectedOptions }) => {
  const navigation = useNavigation<AuthNavigationProp>();

  // Disable button if any field is empty

  return (
    <TouchableOpacity
      style={styles.nextButton} // Apply disabled style if needed
      onPress={() => navigation.navigate('Login1')} // Prevent navigation if button is disabled
    >
      <Text style={styles.nextButtonText}>Get Started</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nextButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#6B2A88',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
    width: '50%',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3', 
  },
});

export default Get_started;
