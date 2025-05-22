import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';
import Bottombar from './Bottombar';
import { useStep } from './StepContext';
import { BASE_URL } from '../config';

const { width, height } = Dimensions.get('window');

const stepData: { image: any; text: string }[] = [
  { image: require('./Stepspics/Step0.png'), text: 'Daily Health Tracker' },
  { image: require('./Stepspics/Step1.png'), text: 'Daily Health Tracker' },
  { image: require('./Stepspics/Step2.png'), text: 'Daily Health Tracker' },
  { image: require('./Stepspics/Step3.png'), text: 'Daily Health Tracker' },
  { image: require('./Stepspics/Step4.png'), text: 'Daily Health Tracker' },
  { image: require('./Stepspics/Step5.png'), text: 'Daily Health Tracker' },
  { image: require('./Stepspics/Step6.png'), text: 'Daily Health Tracker' },
  { image: require('./Stepspics/Step7.png'), text: 'Daily Health Tracker' },
];

const Step7: React.FC = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState<string | null>(null);

  const {
    selectedDate,
    setStepValue,
    setStepNb,
    sleepFatigue,
    medicationAdherence,
    mentalHealth,
    alcoholSubstanceUse,
    physicalActivity,
    foodDiet,
    menstrualCycle,
    stepNb,
    dailyLog,
    setDailyLog,
  } = useStep();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user info:', response.status);
          return;
        }

        const userData = await response.json();
        setGender(userData.gender); // expects gender to be like "Male", "Female", etc.
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    if (dailyLog && dailyLog.date === selectedDate) {
      updateStepsFromData(dailyLog);
      return;
    }

    const fetchData = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `${BASE_URL}/logs/by-day?date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch logs:', response.status);
          return;
        }

        const data = await response.json();
        setDailyLog({ ...data, date: selectedDate });
        updateStepsFromData(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, [selectedDate, dailyLog, gender]);

  const updateStepsFromData = (data: any) => {
    setStepValue('sleepFatigue', !!data.sleep_and_fatigue);
    setStepValue('medicationAdherence', !!data.medication_adherence);
    setStepValue('mentalHealth', !!data.mental_health);
    setStepValue('alcoholSubstanceUse', !!data.alcohol_and_substance_use);
    setStepValue('physicalActivity', !!data.physical_activity);
    setStepValue('foodDiet', !!data.food_and_diet);
    setStepValue('menstrualCycle', !!data.menstrual_cycle);

    const completed = [
      data.sleep_and_fatigue,
      data.medication_adherence,
      data.mental_health,
      data.alcohol_and_substance_use,
      data.physical_activity,
      data.food_and_diet,
      gender !== 'Male' ? data.menstrual_cycle : null,
    ].filter(Boolean).length;

    setStepNb(completed);
  };

const maxIndex = gender === 'Male' ? 6 : 7;

let currentStep;
if (gender === 'Male') {
  currentStep = stepData[6 - stepNb] || stepData[6];
} else {
  currentStep = stepData[stepNb] || stepData[0];
}

  const completedCount: number = [
    sleepFatigue,
    medicationAdherence,
    mentalHealth,
    alcoholSubstanceUse,
    physicalActivity,
    foodDiet,
    gender !== 'Male' ? menstrualCycle : null,
  ].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centered}>
          <Text style={styles.logText}>
  You’ve completed <Text style={styles.completedText}>{completedCount}/{gender === 'Male' ? 6 : 7}</Text> logs today
          </Text>
          <Image source={currentStep.image} style={styles.stepImage} />
          <Text style={styles.title}>{currentStep.text}</Text>
        </View>

        <View style={styles.row}>
          <Icons text1="Sleep" text2="and Fatigue" imageSource={require('./Iconpics/bed.png')} destination="SleepAndFatigue" filled={sleepFatigue} />
          <Icons text1="Medication" text2="Adherence" imageSource={require('./Iconpics/medication.png')} destination="MedicationAdherenceS" filled={medicationAdherence} />
        </View>

        <View style={styles.row}>
          <Icons text1="Mental" text2="Health" imageSource={require('./Iconpics/smily.png')} destination="MentalHealth" filled={mentalHealth} />
          <Icons text1="Alcohol &" text2="Substance Use" imageSource={require('./Iconpics/alcohol.png')} destination="AlcoholAndSubstance" filled={alcoholSubstanceUse} />
        </View>

        <View style={styles.row}>
          <Icons text1="Physical" text2="Activity" imageSource={require('./Iconpics/sport.png')} destination="PhysicalActivityS" filled={physicalActivity} />
          <Icons text1="Food" text2="and Diet" imageSource={require('./Iconpics/food.png')} destination="FoodandDietS" filled={foodDiet} />
        </View>

        {gender !== 'Male' && (
          <View style={[styles.row, { flexWrap: 'wrap' }]}>
            <Icons text1="Menstrual" text2="Cycle" imageSource={require('./Iconpics/pregnancy.png')} destination="MenstrualCycleS" filled={menstrualCycle} />
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <Bottombar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    gap: height * 0.02,
    paddingBottom: height * 0.05,
    backgroundColor: 'white',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logText: {
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    fontSize: width * 0.05,
  },
  completedText: {
    color: '#6B2A88',
  },
  stepImage: {
    width: width * 0.7,
    height: height * 0.05,
    marginBottom: height * 0.02,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: '600',
    color: '#6B2A88',
    fontSize: width * 0.06,
    marginTop: height * 0.02,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  bottomSpacing: {
    height: height * 0.1,
  },
});

export default Step7;
