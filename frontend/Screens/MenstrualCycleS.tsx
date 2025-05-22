import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import RoundRadioButtons from './RoundRadioButtons';
import CustomButton from './CustomButton';
import MyCalendar from './MyCalendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStep } from './StepContext'; // ✅ Import StepContext
import { BASE_URL } from '../config';

const MenstrualCycleS = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [period, setPeriod] = useState('');
  const [pregnancy, setPregnancy] = useState('');
  const [startDate, setStartDate] = useState<string>('');

const { selectedDate, setSelectedDate, setDailyLog, setStepValue } = useStep();

  const handleDateChange = (date: string) => {
    setStartDate(date);
  };

  const isSubmitDisabled = !(period &&
    ((period === 'Yes' && startDate) || (period === 'No' && pregnancy))
  );

  const handleSubmit = async () => {
    if (!selectedDate) {
      console.log('Error', 'Please select a date from the calendar first.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Error', 'User not authenticated.');
        return;
      }

      const payload: any = {
        log_date: selectedDate, // ✅ Use selectedDate here
        period: {
          is_on_period: period === 'Yes',
        },
      };

      if (period === 'Yes' && startDate) {
        payload.period.start_date = new Date(startDate);
      }
      if (period === 'No' && pregnancy) {
        payload.pregnant = pregnancy === 'Yes';
      }

      const response = await fetch(`${BASE_URL}/menstrual-cycle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Error', data.error || 'Failed to log data');
      } else {
        console.log('Success', 'Menstrual cycle log saved!');

        // Save to global daily log (customize structure as needed)
        setDailyLog((prev: any) => ({
          ...prev,
          menstrual_cycle: {
            is_on_period: period === 'Yes',
            start_date: period === 'Yes' ? startDate : null,
            pregnant: period === 'No' ? (pregnancy === 'Yes') : null,
          },
          date: selectedDate,
        }));

        // Mark step as completed
        setStepValue('menstrualCycle', true);

        // Reset local state if desired
        setPeriod('');
        setPregnancy('');
        setStartDate('');

        // Navigate to Step7
        navigation.navigate(`Step7`);
      }
    } catch (error: any) {
      console.log('Error', error.message || 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Step7')}
            style={{ padding: 20 }} // Increase padding for easier touch
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Expands touch area
          >
            <Image source={require("./Loginpics/vector.png")} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.purpleText}>Menstrual Cycle</Text>
        </View>

        {/* Period Selection */}
        <View style={styles.section}>
          <View style={{ justifyContent: "center", alignItems: 'center' }}>
            <Text style={styles.blackText}>Are you on your</Text>
            <Text style={styles.blackText}>period?</Text>
          </View>
          <RoundRadioButtons
            options={['Yes', 'No']}
            selectedOption={period}
            onSelect={(option) => setPeriod(option)}
          />
        </View>

        {/* Conditionally render calendar if period is "Yes" */}
        {period === 'Yes' && (
          <View style={styles.section}>
            <Text style={styles.blackText}>Enter Start Date</Text>
            <View style={styles.calendarContainer}>
              <MyCalendar onDateSelect={handleDateChange} />
            </View>
          </View>
        )}

        {/* Conditionally render pregnancy question if period is "No" */}
        {period === 'No' && (
          <View style={styles.section}>
            <Text style={styles.blackText}>Are you pregnant?</Text>
            <RoundRadioButtons
              options={['Yes', 'No']}
              selectedOption={pregnancy}
              onSelect={(option) => setPregnancy(option)}
            />
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <CustomButton 
            text="Submit" 
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-around',
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
  },
  purpleText: {
    fontSize: 30,
    color: '#6B2A88',
    fontWeight: '600',
  },
  image: {
    position: 'absolute',
    right: 40,
  },
  blackText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 25,
    textAlign: 'center',
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
    marginTop: 40,
  },
  calendarContainer: {
    height: 420,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default MenstrualCycleS;