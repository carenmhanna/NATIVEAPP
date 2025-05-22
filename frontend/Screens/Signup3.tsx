import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import Bottombar from './Bottombar';
import Dropdownlong from './Dropdownlong';
import SearchComponent from './SearchComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import { BACKEND_IP } from '../config'; // adjust the path if needed
import Signupbar from './Signupbar';
import { BASE_URL } from '../config';
 
type Signup3RouteProp = RouteProp<{ Signup3: { gender?: string; [key: string]: any } }, 'Signup3'>;
 
type MedicationEntry = {
  medication_name: string;
  frequency: string;
  dose: string;
};
 
const Signup3 = () => {
  const route = useRoute<Signup3RouteProp>();
  const navigation = useNavigation<AuthNavigationProp>();
 const { width } = Dimensions.get('window');

  const gender = route?.params?.gender ?? '1';
 
  const [period, setPeriod] = useState('');
  // Changed to array of MedicationEntry objects
  const [selectedOptions, setSelectedOptions] = useState<MedicationEntry[]>([]);
  // Controlled inputs for frequency and dose when adding a medication
  const [inputFrequency, setInputFrequency] = useState('');
  const [inputDose, setInputDose] = useState('');
  const [currentMedication, setCurrentMedication] = useState('');
  const [isMedicationSelected, setIsMedicationSelected] = useState(false);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    console.log('Live state:', {
      gender,
      selectedOptions,
      period: gender !== 'Male' ? period : null,
      previousParams: route.params,
    });
  }, [gender, selectedOptions, period, route.params]);
 
  // Accepts a single medication string from SearchComponent selection
  const handleMedicationSelection = (newMedications: string[]) => {
    // For simplicity, handle only the first selected medication if multiple sent
    const med = newMedications[0];
    setCurrentMedication(med);
    // Reset inputs for frequency and dose when selecting a new medication
    setInputFrequency('');
    setInputDose('');
  };
 
  // Called when user confirms adding medication with freq & dose
  const addMedication = () => {
    if (!currentMedication) return;
    if (!inputFrequency.trim()) return console.log('Please enter frequency');
    if (!inputDose.trim()) return console.log('Please enter dose');

    setSelectedOptions((prev) => [
      ...prev,
      {
        medication_name: currentMedication,
        frequency: inputFrequency.trim(),
        dose: inputDose.trim(),
      },
    ]);

    setCurrentMedication('');
    setInputFrequency('');
    setInputDose('');
    setIsMedicationSelected(true);
  };

  const removeMedication = (medication_name: string, dose: string) => {
    setSelectedOptions((prev) =>
      prev.filter(
        (med) =>
          !(
            med.medication_name === medication_name &&
            med.dose === dose
          )
      )
    );
  };

  const handleGetStarted = async () => {
    console.log('Get Started pressed');

    if (selectedOptions.length === 0) {
      console.log('Please add at least one medication');
      return;
    }

    if (gender !== 'Male' && !period) {
      console.log('Please select menstrual cycle status');
      return;
    }

    // Flatten all params from previous screens
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      date_of_birth,
      gender: genderFromParams,
      seizureTypes,
    } = route.params;

    // No more other_medication_name logic!
    const mappedMedications = selectedOptions.map(opt => ({
      medication_name: opt.medication_name,
      dose: opt.dose,
      frequency: opt.frequency,
    }));



    const dataToSend = {
      first_name,
      last_name,
      email,
      password,
      phone,
      gender: gender || genderFromParams,
      date_of_birth,
      seizureTypes: Array.isArray(seizureTypes) ? seizureTypes[0] : seizureTypes,
      medication: mappedMedications,
      menstrualCycleStatus: gender !== 'Male' ? period : undefined,
    };

    console.log('Sending data: ' + JSON.stringify(dataToSend, null, 2));

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const rawText = await response.text();
      console.log(`Raw response: ${rawText}`);

      let responseData;
      try {
        responseData = JSON.parse(rawText);
      } catch (error: unknown) {
        console.log('Error: Could not parse server response');
      }

      if (!response.ok) {
        const errorMessage = responseData?.message || `Server responded with ${response.status}`;
        console.log(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      console.log(responseData.message || 'Registration successful!');
      navigation.navigate('LoginScreen');
    } catch (error: any) {
      console.log(`Error caught: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
 
  const isFormValid = () => {
  if (selectedOptions.length === 0) return false;
  if (gender !== 'Male' && !period) return false;
  return true;
};
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.topView}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#6B2A88" />
             
            </TouchableOpacity>
            <Text style={[styles.text, { fontSize: width * 0.08 }]}>New Account</Text>
          </View>
 
           <Signupbar currentStep={3} />

 
          <View style={styles.middlecontainer}>
            <Text style={styles.blacktext}>Name of Medication</Text>
            <View style={styles.dropdownRow}>
              <SearchComponent
                setSelectedOptions={handleMedicationSelection}
                setSelectedDataOutside={(data) => {
  setSelectedOptions(
    data.map(({ medication, dose, frequency }) => ({
      medication_name: medication,
      dose,
      frequency,
    }))
  ); // 👈 update state with full list
}}
 
              />
            </View>
 
            {gender !== 'Male' && (
              <View style={styles.dropdownSection}>
                <Text style={styles.blacktext}>Menstrual Cycle Status</Text>
                <Dropdownlong
                  placeholder="Choose Type"
                  options={[
                    { key: 'Regular', value: 'Regular' },
                    { key: 'Irregular', value: 'Irregular' },
                    { key: 'Menopause', value: 'Menopause' },
                  ]}
                  setSelected={setPeriod}
                />
              </View>
            )}
 
            {/* Show selected medications with frequency and dose */}
            {isMedicationSelected && selectedOptions.length > 0 && (
              <View style={styles.selectedInfoContainer}>
                <Text style={styles.selectedText}>Selected Medications:</Text>
                {selectedOptions.map(({ medication_name, frequency, dose }, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                  >
                    <Text style={styles.medicationText}>
                      {medication_name} - {dose} - {frequency}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeMedication(medication_name, dose)}
                      style={{ marginLeft: 10 }}
                    >
                      <Text style={{ color: 'red' }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
 
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleGetStarted}
                style={{ width: '100%', alignItems: 'center' }}
                disabled={loading}
              >
           
              </TouchableOpacity>
 
             
            </View>
            <View style={styles.buttonContainer}>
  <TouchableOpacity
    onPress={handleGetStarted}
    disabled={!isFormValid() || loading}
    style={[
      styles.purpleButton,
      {
        backgroundColor: isFormValid() && !loading ? '#6B2A88' : '#ccc',
      },
    ]}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <Text style={styles.buttonText}>Get Started</Text>
    )}
  </TouchableOpacity>
</View>
 
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
 
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    alignItems: 'center',
  },
  blacktext: {
    fontSize: 27,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
  },
  middlecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
    gap: 10,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:20,
    gap:10,
  },
  text: {
    fontSize: 30,
    color: '#6B2A88',
    fontWeight: '600',
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 0,
  },
  dropdownRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  dropdownSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
  },
  selectedInfoContainer: {
    marginTop: 30,
    width: '90%',
    backgroundColor: '#EABAFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B2A88',
  },
  medicationText: {
    fontSize: 18,
    color: '#6B2A88',
  },
  buttonContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6B2A88',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6B2A88',
    paddingVertical: 10,
    marginTop: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  purpleButton: {
  width: '90%',
  paddingVertical: 15,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
},
buttonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: '600',
},
 
});
 
export default Signup3;