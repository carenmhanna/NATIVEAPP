import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import MyCalendar from './MyCalendar';
import Seizure from './Seziure'; // Fixed typo from 'Seziure'
import Bottombar from './Bottombar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStep } from './StepContext'; // adjust path if needed
import { BASE_URL } from '../config';

const Login1 = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [seizureDays, setSeizureDays] = useState<string[]>([]); // Store seizure days

  const {
    setSelectedDate,
    setStepNb,
    selectedDate,
    setDailyLog,  // Save logs globally
    dailyLog,     // (optional) use data inside screen
  } = useStep();

  const onDateSelect = async (date: string) => {
    setSelectedDate(date); // Update global selected date

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.warn('No token found in AsyncStorage');
        return;
      }

      const response = await fetch(`${BASE_URL}/logs/by-day?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching logs:', response.status, errorData);
        return;
      }

      const data = await response.json();
      console.log('Logs for selected date:', data);
      setDailyLog(data); // Save logs globally

      // Update step count based on logs received
      const stepCount = Object.values(data).filter(Boolean).length;
      setStepNb(stepCount);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fetch error:', error.message);
      } else {
        console.error('Fetch error:', String(error));
      }
    }
  };

  useEffect(() => {
    const fetchSeizureDays = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn('No token found in AsyncStorage');
          return;
        }

        const response = await fetch(`${BASE_URL}/seizures/days`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching seizure days:', response.status, errorData);
          return;
        }

        const days = await response.json(); // array of date strings
        console.log('Seizure days:', days);
        setSeizureDays(days); // Save seizure days in state
      } catch (error) {
        console.error('Fetch error (seizure days):', error);
      }
    };

    fetchSeizureDays();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Pass seizureDays as markedDatesArray prop */}
        <MyCalendar onDateSelect={onDateSelect} seizureDates={seizureDays} />

        <View style={styles.seizureContainer}>
          {/* Use selectedDate from context */}
          <Seizure date={selectedDate} loggedDates={seizureDays}/>
        </View>
      </ScrollView>

      <View style={styles.bottomBarWrapper}>
        <Bottombar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 5,
    paddingBottom: 100,
    alignItems: 'center',
  },
  seizureContainer: {
    width: '100%',
    alignItems: 'center',
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 15 : 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
});

export default Login1;
