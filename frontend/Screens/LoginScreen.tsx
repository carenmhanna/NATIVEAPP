import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import { BACKEND_IP } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const { width, height } = Dimensions.get('window');
 
const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();  
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async () => {
    if (!name.trim() || !pass.trim()) {
      console.log('Validation Error', 'Please enter both email/mobile and password.');
      return;
    }
 
    setLoading(true);
 
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
  email: name.trim(),
  password: pass,
}),
});
 
 
      const data = await response.json();
 
      if (!response.ok) {
        // Handle errors returned from backend
        console.log('Login Failed', data.error || 'Invalid credentials');
      } else {
        // Login success, you can store token and navigate
        await AsyncStorage.setItem('token', data.token);
 
        // Navigate to Login1 screen after successful login
        navigation.navigate('Login1');
      }
    } catch (error) {
      console.log('Network Error', 'Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.topView}>
            <View style={styles.center}>
              <Image
                source={require('./Loginpics/ribbon.png')}
                style={[styles.image, { width: width * 0.05 }]}
              />
              <Text style={[styles.text, { fontSize: width * 0.08 }]}>Hello</Text>
              <Image
                source={require('./Loginpics/ribbon.png')}
                style={[styles.image, { width: width * 0.05 }]}
              />
            </View>
          </View>
 
          <View style={styles.col}>
            <Text style={styles.purpletext}>Welcome</Text>
            <Text style={styles.blacktext}>Email or Mobile</Text>
            <TextInput
              style={[styles.input, { width: width * 0.9 }]}
              placeholder="example@example.com"
              placeholderTextColor="#CA7FEB"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="username"
            />
 
            <Text style={styles.blacktext}>Password</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { width: width * 0.9 }]}
                secureTextEntry={isPasswordHidden}
                value={pass}
                onChangeText={setPass}
                autoCapitalize="none"
                textContentType="password"
              />
              <TouchableOpacity
                style={{ position: 'absolute', marginTop: 30, marginLeft: width * 0.75 }}
                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
              >
                <Image source={require('./Loginpics/eye.png')} />
              </TouchableOpacity>
            </View>
 
           
          </View>
 
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 15,
              marginTop: height * 0.05,
            }}
          >
            <TouchableOpacity
              style={{ width: '90%', backgroundColor: '#6B2A88', padding: 15, borderRadius: 20, alignItems: 'center' }}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
 
            <Text>or</Text>
 
            <View style={{ flexDirection: 'row' }}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={styles.signup}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
 
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#EABAFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  purpletext: {
    color: '#6B2A88',
    fontSize: 24,
    fontWeight: '600',
  },
  signup: {
    color: '#6B2A88',
    fontSize: 15,
    fontWeight: '600',
  },
  col: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 70,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 24,
    color: '#6B2A88',
    marginHorizontal: 10,
    fontWeight: '600',
  },
  image: {
    height: 29,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blacktext: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 20,
  },
});
 
export default LoginScreen;