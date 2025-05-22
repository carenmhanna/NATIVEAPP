import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BASE_URL } from '../config';


const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = Dimensions.get('window');
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [seizureType, setSeizureType] = useState('');

  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);
  const [seizureDropdownVisible, setSeizureDropdownVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genders = ['Female', 'Male', 'Other', 'Prefer not to say'];
  const seizureTypes = [
    'Focal With Loss of Awareness',
    'Focal Without Loss of Awarness',
    'Generalized',
    'Non-epileptic',
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) return;
        const decoded: any = jwtDecode(storedToken);
        const userId = decoded.id || decoded._id;
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const data = await response.json();
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setMobileNumber(data.phone || '');
        setBirthDate(data.date_of_birth ? new Date(data.date_of_birth).toLocaleDateString() : '');
        setGender(data.gender || '');
        setSeizureType(data.seizureTypes || '');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) return;
      const decoded: any = jwtDecode(storedToken);
      const userId = decoded.id || decoded._id;

      const updatedUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: mobileNumber,
        date_of_birth: birthDate,
        gender: gender,
        seizureTypes: seizureType,
      };

      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        console.log('Profile updated successfully!');
        navigation.navigate('MyProfileScreen' as never);
      } else {
        const errorData = await response.json();
        console.log(errorData.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.log('An error occurred while saving changes.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate.toLocaleDateString());
    }
  };

  const renderDropdown = (
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    options: string[],
    onSelect: (item: string) => void
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setVisible(false)}
        activeOpacity={1}
      >
        <View style={styles.dropdownContainer}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  setVisible(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6B2A88" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView>
          
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('MyProfileScreen' as never)}>
            <Text style={{fontSize: 24, color: '#6B298A', marginRight: 10}}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Edit Profile</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.inputText} value={firstName} onChangeText={setFirstName} />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.inputText} value={lastName} onChangeText={setLastName} />
        </View>

        <View style={[styles.inputBox, styles.disabledBox]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.inputText, styles.disabledInput]}
            value={email}
            editable={false}
            selectTextOnFocus={false}
            keyboardType="email-address"
            placeholderTextColor="#BDBDBD"
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.inputText}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.smallInputBox}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.inputText}>{birthDate}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallInputBox}
            onPress={() => setGenderDropdownVisible(true)}
          >
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.inputText}>{gender}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate ? new Date(birthDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.row}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.smallInputBox, styles.centeredSeizureBox]}
            onPress={() => setSeizureDropdownVisible(true)}
          >
            <Text style={styles.label}>Type of Seizure</Text>
            <Text style={styles.inputText}>{seizureType}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {renderDropdown(genderDropdownVisible, setGenderDropdownVisible, genders, setGender)}
        {renderDropdown(seizureDropdownVisible, setSeizureDropdownVisible, seizureTypes, setSeizureType)}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 20,
    color: '#6B298A',
    fontWeight: 'bold',
  },
  inputBox: {
    backgroundColor: '#F4DBFF',
    borderColor: '#6B2A88',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  disabledBox: {
    backgroundColor: '#F6E6F9',
    borderColor: '#E0BFE6',
  },
  label: {
    color: '#B766DA',
    fontSize: 12,
    marginBottom: 4,
  },
  inputText: {
    color: '#4B5563',
    fontSize: 16,
  },
  disabledInput: {
    color: '#A0A0A0',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  smallInputBox: {
    flex: 1,
    backgroundColor: '#F4DBFF',
    borderColor: '#6B2A88',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  centeredSeizureBox: {
    alignSelf: 'center',
    minWidth: 180,
    maxWidth: 250,
  },
  saveButton: {
    backgroundColor: '#692985',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    maxHeight: '60%',
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});