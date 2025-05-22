import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';

interface NextProps {
    name:string;
    pass:string;
}

const LoginButton: React.FC<NextProps> = ({ name,pass }) => {
  const navigation = useNavigation<AuthNavigationProp>();

  // Disable button if any field is empty
  const isButtonDisabled = !(name && pass ); // All fields must be non-empty

  return (
    <TouchableOpacity  onPress={() => navigation.navigate('Login1')}
      style={[styles.nextButton, isButtonDisabled && styles.disabledButton]} // Apply disabled style if needed
      disabled={isButtonDisabled} // Disable button if isButtonDisabled is true
    >
      <Text style={styles.nextButtonText}>Log In</Text>
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

export default LoginButton;
