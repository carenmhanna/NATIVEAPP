import React, { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import Icon from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import Signupbar from './Signupbar';

const { width, height } = Dimensions.get('window');
 
const SignupScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastname, setlastName] = useState('');
  const [pass, setPass] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef<PhoneInput>(null);
 
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 
  const allFieldsValid =
    name &&
    lastname &&
    pass &&
    email &&
    phoneInput.current?.isValidNumber(phoneNumber) &&
    isValidEmail(email);
 
  const handleNext = () => {
    if (!allFieldsValid) {
      console.log('Please fill in all fields with valid information.');
      return;
    }
 
    // Instead of fetch, just navigate and pass data
    navigation.navigate('Signuptwo', {
      first_name: name,
      last_name: lastname,
      password: pass,
      email: email,
      phone: formattedValue,
    });
   
  };
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView style={styles.container}>
            <View style={styles.topView}>
              <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}
                style={styles.backButton}
              >
              <Icon name="arrow-back" size={24} color="#6B2A88" />

              </TouchableOpacity>
              <Text style={[styles.text, { fontSize: width * 0.08 }]}>New Account</Text>
            </View>
 
            <Signupbar currentStep={1} />

 
            <View style={styles.formContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[styles.input, { width: width * 0.9 }]}
                placeholder="Enter your name"
                placeholderTextColor="#CA7FEB"
                value={name}
                onChangeText={setName}
              />
 
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[styles.input, { width: width * 0.9 }]}
                placeholder="Enter your last name"
                placeholderTextColor="#CA7FEB"
                value={lastname}
                onChangeText={setlastName}
              />
 
              <Text style={styles.label}>Password</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { width: width * 0.9 }]}
                  secureTextEntry={isPasswordHidden}
                  placeholder="Password"
                  placeholderTextColor="#CA7FEB"
                  value={pass}
                  onChangeText={setPass}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 30 }}
                  onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                >
                  <Icon
                  name={isPasswordHidden ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#6B2A88"
                />
                </TouchableOpacity>
              </View>
 
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, { width: width * 0.9 }]}
                placeholder="Enter your email"
                placeholderTextColor="#CA7FEB"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
 
              <Text style={styles.label}>Mobile Number</Text>
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                defaultCode="LB"
                layout="first"
                onChangeText={setPhoneNumber}
                onChangeFormattedText={setFormattedValue}
                containerStyle={{
                  backgroundColor: '#EABAFF',
                  borderRadius: 20,
                  width: width * 0.9,
                  marginBottom: 10,
                }}
                textContainerStyle={{
                  backgroundColor: '#EABAFF',
                  borderRadius: 20,
                }}
              />
 
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>By continuing, you agree to </Text>
                <View style={styles.termsRow}>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>Terms of Use </Text>
                  </TouchableOpacity>
                  <Text style={styles.termsText}>or </Text>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>
 
                <TouchableOpacity
                  onPress={handleNext}
                  disabled={!allFieldsValid}
                  style={[
                    styles.nextButton,
                    {
                      backgroundColor: allFieldsValid ? '#6B2A88' : '#CA7FEB99',
                    },
                  ]}
                >
                  <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
              </View>
 
              <View style={{ height: 100 }} />
            </View>
          </ScrollView>
 
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen') as never}>
              <Text style={styles.signup}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.08,
    marginBottom: height * 0.04,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  text: {
    color: '#6B2A88',
    fontWeight: '600',
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
    height: height * 0.08,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#EABAFF',
    borderRadius: 20,
    padding: 15,
    height: 60,
    marginBottom: 10,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#EABAFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 60,
    justifyContent: 'center',
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  termsText: {
    color: '#666',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: '#6B2A88',
    fontWeight: '500',
  },
  nextButton: {
    paddingVertical: 15,
    borderRadius: 30,
    width: width * 0.7,
    alignItems: 'center',
    marginTop: 20,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  loginText: {
    color: '#666',
  },
  signup: {
    color: '#6B2A88',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
  stepImage: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
  },
  stepLine: {
    width: width * 0.2,
    height: 17,
    resizeMode: 'contain',
  },
});
 
export default SignupScreen;