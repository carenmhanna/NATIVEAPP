// ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../config';
const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadTokenAndUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const decoded: any = jwtDecode(storedToken);
          setUserId(decoded.id || decoded._id);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      }
    };
    loadTokenAndUserId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) return;
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, token]);

  const handleAllowPress = () => setDropdownVisible(!dropdownVisible);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6B2A88" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.halfCircle} />
      <Image
        source={require('./ProfileScreenpics/profile-placeholder.png')}
        style={styles.profileImage}
        resizeMode="cover"
      />
      <Text style={styles.name}>
        {userData ? `${userData.first_name || ''} ${userData.last_name || ''}` : ''}
      </Text>
      <Text style={styles.email}>
        {userData ? userData.email || '' : ''}
      </Text>

      <TouchableOpacity
  onPress={() => navigation.goBack()}
  style={styles.backButton}
>
  <Icon name="arrow-back" size={28} color="#6B2A88" />
</TouchableOpacity>


      <View style={styles.buttonsContainer}>
        <CustomButton
          text="My Profile"
          bgColor="#F4DBFF"
          icon={require('./ProfileScreenpics/profile-icon.png')}
          onPress={() => navigation.navigate('MyProfileScreen' as never)}
        />
        <CustomButton
          text="Settings"
          bgColor="#E3D1EA"
          icon={require('./ProfileScreenpics/settings-icon.png')}
          onPress={() => navigation.navigate('SettingsScreen' as never)}
        />
        <CustomButton
          text="Log out"
          bgColor="#E3D1EA"
          icon={require('./ProfileScreenpics/logout-icon.png')}
          onPress={() => navigation.navigate('LoginScreen')}
        />
      </View>

      <Modal transparent visible={dropdownVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownOption}>Dropdown Option 1</Text>
              <Text style={styles.dropdownOption}>Dropdown Option 2</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const CustomButton = ({ text, bgColor, icon, onPress }: any) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={icon} style={styles.icon} />
      <Text style={styles.buttonText}>{text}</Text>
      <Image
        source={require('./ProfileScreenpics/arrow-icon.png')}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
  position: 'absolute',
  top: 50, // or use a dynamic value with `Platform.select` for iOS/Android
  left: 20,
  zIndex: 10,
  padding: 10,
},

  title: {
    fontSize: width * 0.07,
    color: '#6B298A',
    marginTop: 30,
    fontWeight: 'bold',
  },
  halfCircle: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: '#EABAFF',
    top: -width * 1.5,
    left: -width / 2,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    marginTop: 20,
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    fontSize: width * 0.06,
    color: '#35014B',
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: width * 0.04,
    color: '#CA7FEB',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '90%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 13,
    marginVertical: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    flex: 1,
    fontSize: width * 0.045,
    color: '#6B298A',
    fontWeight: '600',
  },
  arrow: {
    width: 18,
    height: 18,
    tintColor: '#6B298A',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: 150,
  },
  dropdownOption: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#6B298A',
    textAlign: 'center',
  },
});