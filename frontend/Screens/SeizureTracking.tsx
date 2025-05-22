import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import Dropdownlong from './Dropdownlong';
import NumberBoxapi from './Numberboxapi';
import Minutes from './minutes';
import RoundRadioButtons from './RoundRadioButtons';
import CheckboxWithLabel from './CheckboxWithLabel';
import CustomButton from './CustomButton';
import Hour from './hour';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useStep } from './StepContext';
import { BASE_URL } from '../config';

const SeizureTrackingS = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [SeizureType, setSeizureType] = useState('');
  const [selected, setSelected] = useState('');
  const [fatigueChecked, setFatigueChecked] = useState(false);
  const [headacheChecked, setHeadacheChecked] = useState(false);
  const [confusionChecked, setConfusionChecked] = useState(false);
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherText, setOtherText] = useState('');
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);

  const otherInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (otherChecked && otherInputRef.current) {
      otherInputRef.current.focus();
    }
  }, [otherChecked]);

  const isFormValid =
    SeizureType !== '' &&
    selected !== '' &&
    (!otherChecked || (otherChecked && otherText.trim() !== ''));

  // Helper to build postictal symptoms array
  const getPostictalSymptoms = () => {
    const symptoms = [];
    if (fatigueChecked) symptoms.push('Fatigue');
    if (headacheChecked) symptoms.push('Headache');
    if (confusionChecked) symptoms.push('Confusion');
    if (otherChecked && otherText.trim() !== '') symptoms.push(otherText.trim());
    return symptoms;
  };

  const {
      selectedDate
    } = useStep();

  const handleLogSeizure = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Error', 'User not authenticated.');
        return;
      }
      const decoded: any = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      // Set today's date at midnight for consistency
      const today = new Date();
      const localDateString = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

      const payload = {
        userId,
        seizure_type: SeizureType,
        aura: selected === 'Yes',
        postictal_symptoms: getPostictalSymptoms(),
        seizure_day: selectedDate,
        duration: {
          hours: durationHours,
          minutes: durationMinutes,
        },
      };

      const response = await fetch(`${BASE_URL}/seizures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success', 'Seizure logged successfully!');
        navigation.navigate('Login1');
      } else {
        console.log('Error', data.error || 'Failed to log seizure');
      }
    } catch (error) {
      console.log('Error', 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Step7')}>
              <Image source={require('./Loginpics/vector.png')} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.purpleText}>Seizure Tracking</Text>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Text style={styles.blackText}>Seizure Type</Text>
            <Dropdownlong
              placeholder="Select Type"
             options={[
  { key: 'Focal', value: 'Focal' },
  { key: 'Generalized', value: 'Generalized' },
  { key: 'Myoclonic', value: 'Myoclonic' },
  { key: 'Absence', value: 'Absence' },
  { key: 'Tonic', value: 'Tonic' },
  { key: 'Clonic', value: 'Clonic' },
  { key: 'Non-epileptic', value: 'Non-epileptic' },
]}

              setSelected={setSeizureType}
            />
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Text style={styles.blackText}>Seizure Duration</Text>
            <View style={styles.boxContainer}>
              <NumberBoxapi
                option="Hours"
                value={durationHours}
                setValue={setDurationHours}
                onSave={() => {}}
              />
              <Hour />
              <NumberBoxapi
                option="Minutes"
                value={durationMinutes}
                setValue={setDurationMinutes}
                onSave={() => {}}
              />
              <Minutes />
            </View>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 30 }}>
            <Text style={styles.blackText}>Aura Symptoms</Text>
            <RoundRadioButtons
              options={['Yes', 'No']}
              selectedOption={selected}
              onSelect={(option) => setSelected(option)}
            />
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <Text style={styles.blackText}>Postical Symptoms</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
              <CheckboxWithLabel
                label="Fatigue"
                checked={fatigueChecked}
                onToggle={() => setFatigueChecked(!fatigueChecked)}
              />
              <CheckboxWithLabel
                label="Headache"
                checked={headacheChecked}
                onToggle={() => setHeadacheChecked(!headacheChecked)}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
              <CheckboxWithLabel
                label="Confusion"
                checked={confusionChecked}
                onToggle={() => setConfusionChecked(!confusionChecked)}
              />
              <CheckboxWithLabel
                label="Other"
                checked={otherChecked}
                onToggle={() => setOtherChecked(!otherChecked)}
              />
            </View>

            {otherChecked && (
              <TextInput
                ref={otherInputRef}
                style={{
                  borderWidth: 1,
                  borderColor: '#B766DA',
                  padding: 15,
                  borderRadius: 8,
                  width: '90%',
                  fontSize: 16,
                  backgroundColor: '#EABAFF',
                  color: 'white',
                }}
                placeholder="Enter..."
                placeholderTextColor="white"
                value={otherText}
                onChangeText={setOtherText}
              />
            )}
          </View>
        </View>

        <View style={{ width: '70%', justifyContent: 'center', alignSelf: 'center', marginTop: 30 }}>
          <CustomButton
            text="Log Seizure"
            onPress={handleLogSeizure}
            disabled={!isFormValid}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 50,
  },
  topBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
  },
  purpleText: {
    fontSize: 30,
    color: '#6B2A88',
    fontWeight: '600',
  },
  image: {
    position: 'relative',
    right: 45,
  },
  blackText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 25,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EABAFF',
    borderRadius: 20,
    padding: 15,
    width: '85%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
});

export default SeizureTrackingS;