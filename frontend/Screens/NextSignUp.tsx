import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';

interface NextProps {
    email:string;
    name:string;
    lastname:string;
    nb:string;
    pass:string;
}

const NextSignUp: React.FC<NextProps> = ({ email,name,nb,pass,lastname }) => {
  const navigation = useNavigation<AuthNavigationProp>();

  const isButtonDisabled = !(email && nb && name && pass &&lastname); // All fields must be non-empty

  return (
    <TouchableOpacity
      style={[styles.nextButton, isButtonDisabled && styles.disabledButton]} // Apply disabled style if needed
      onPress={() => !isButtonDisabled && navigation.navigate('Signuptwo' as never)}
      disabled={isButtonDisabled} // Disable button if isButtonDisabled is true
    >
      <Text style={styles.nextButtonText}>Next</Text>
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
    backgroundColor: '#d3d3d3', // Light gray color for disabled state
  },
});

export default NextSignUp;
