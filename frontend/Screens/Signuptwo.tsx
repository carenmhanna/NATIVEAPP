import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import Icon from 'react-native-vector-icons/Ionicons';
import Dropdownlong from './Dropdownlong';
import CheckboxWithLabel from './CheckboxWithLabel';

import Signupbar from './Signupbar';
const { width } = Dimensions.get('window');

const Signuptwo = () => {
  const route = useRoute();
  console.log('Data received from Screen 1:', route.params);

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [focalWithAwareness, setFocalWithAwareness] = useState(false);
  const [focalWithoutAwareness, setFocalWithoutAwareness] = useState(false);
  const [generalized, setGeneralized] = useState(false);
  const [nonEpileptic, setNonEpileptic] = useState(false);

  const navigation = useNavigation<AuthNavigationProp>();

  const currentYear = new Date().getFullYear();
  const daysList = Array.from({ length: 31 }, (_, i) => ({
    key: (i + 1).toString(),
    value: (i + 1).toString(),
  }));
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ].map((month, i) => ({ key: `${i + 1}`, value: month }));
  const yearsList = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { key: year, value: year };
  });

  const genderList = ['Male', 'Female', 'Other', 'Prefer not to say'].map(g => ({
    key: g,
    value: g,
  }));

  const isAnyCheckboxChecked =
    focalWithAwareness || focalWithoutAwareness || generalized || nonEpileptic;
  const isFormValid = day && month && year && gender && isAnyCheckboxChecked;

  const selectedTypes = [
    focalWithAwareness && 'Focal With Loss of Awareness',
    focalWithoutAwareness && 'Focal Without Loss of Awareness',
    generalized && 'Generalized',
    nonEpileptic && 'Non-Epileptic',
  ]
    .filter(Boolean)
    .join(', ');

  const NextButton = ({
    isButtonDisabled,
    onPress,
  }: {
    isButtonDisabled: boolean;
    onPress?: () => void;
  }) => {
    return (
      <TouchableOpacity
        style={[styles.nextButton, isButtonDisabled && styles.disabledButton]}
        onPress={onPress}
        disabled={isButtonDisabled}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topView}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
            <Icon name="arrow-back" size={24} color="#6B2A88" />
             
            </TouchableOpacity>
            <Text style={[styles.text, { fontSize: width * 0.08 }]}>
              New Account
            </Text>
          </View>

          <Signupbar currentStep={2} />


          <View style={styles.middlecontainer}>
            <Text style={styles.blacktext}>Date of Birth</Text>
            <View style={styles.dropdownRow}>
              <Dropdownlong placeholder="Day" options={daysList} setSelected={setDay} />
              <Dropdownlong placeholder="Month" options={monthsList} setSelected={setMonth} />
              <Dropdownlong placeholder="Year" options={yearsList} setSelected={setYear} />
            </View>

            <View style={styles.dropdownSection2}>
              <Text style={styles.blacktext}>Gender</Text>
              <Dropdownlong
              placeholder="Choose Gender"
              options={genderList}
              setSelected={(selectedValue) => setGender(selectedValue)}
              />
            </View>

            <View style={styles.dropdownSection}>
              <Text style={styles.blacktext}>Type of Seizure</Text>
              <CheckboxWithLabel
                label="Focal With Loss of Awareness"
                checked={focalWithAwareness}
                onToggle={() => setFocalWithAwareness(!focalWithAwareness)}
              />
              <CheckboxWithLabel
                label="Focal Without Loss of Awareness"
                checked={focalWithoutAwareness}
                onToggle={() => setFocalWithoutAwareness(!focalWithoutAwareness)}
              />
              <CheckboxWithLabel
                label="Generalized"
                checked={generalized}
                onToggle={() => setGeneralized(!generalized)}
              />
              <CheckboxWithLabel
                label="Non-Epileptic"
                checked={nonEpileptic}
                onToggle={() => setNonEpileptic(!nonEpileptic)}
              />
            </View>

            <View style={styles.buttonContainer}>
              <NextButton
                isButtonDisabled={!isFormValid}
                onPress={() => {
                  // Convert month name to number
                  const monthNumber = monthsList.find(m => m.value === month)?.key || '1';
                  // Create ISO date string
                  const date_of_birth = new Date(
                    Number(year),
                    Number(monthNumber) - 1,
                    Number(day)
                  ).toISOString();

                  const selectedSeizureTypes: string[] = [];
                  if (focalWithAwareness) selectedSeizureTypes.push('Focal With Loss of Awareness');
                  if (focalWithoutAwareness) selectedSeizureTypes.push('Focal Without Loss of Awareness');
                  if (generalized) selectedSeizureTypes.push('Generalized');
                  if (nonEpileptic) selectedSeizureTypes.push('Non-epileptic');

                  navigation.navigate('Signup3', {
                    ...(route.params as {
                      email: string;
                      first_name: string;
                      last_name: string;
                      password: string;
                      phone: string;
                    }),
                    date_of_birth, // ISO string
                    gender,
                    seizureTypes: selectedSeizureTypes, // string[]
                  });
                }}
              />
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
    paddingBottom: 50,
    alignItems: 'center',
  },
  blacktext: {
    fontSize: width * 0.065,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
  },
  middlecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:30,
  },
  text: {
    fontSize: width * 0.08,
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
  backButton: {
    position: 'relative',
    right: 30,
  },
  dropdownRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  dropdownSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
  },
  dropdownSection2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  nextButtonText: {
    color: 'white',
    fontSize: width * 0.05,
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
  buttonContainer: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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

export default Signuptwo;