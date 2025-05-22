import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import NumberBox from './Numberbox';
import Liters from './liters';
import CustomButton from './CustomButton';
import Meals from './meals';
import { useStep } from './StepContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const FoodandDietS = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const [mealsPerDay, setMealsPerDay] = useState(0);
  const [litersPerDay, setLitersPerDay] = useState(0);

  const isButtonDisabled = mealsPerDay === 0 || litersPerDay === 0;

  const { selectedDate } = useStep();

  const { setDailyLog, setStepValue, setStepNb } = useStep();

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

    const response = await fetch(`${BASE_URL}/food-and-diet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meal_frequency: mealsPerDay,
        water: litersPerDay,
        log_date: selectedDate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('Error', data.error || 'Failed to log data');
    } else {
      setDailyLog((prev: any) => ({
        ...prev,
        food_and_diet: {
          meal_frequency: mealsPerDay,
          water: litersPerDay,
        },
        date: selectedDate,
      }));

      setStepValue('foodDiet', true);

      console.log('Success', 'Food and diet log saved!');
      navigation.navigate('Step7');
    }
  } catch (error) {
    console.log('Error', 'Something went wrong.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Step7')}
            style={{ padding: 20 }} // Increase padding for easier touch
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Expands touch area
          >
            <Image source={require('./Loginpics/vector.png')} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.purpleText}>Food and Diet</Text>
        </View>

        {/* Meal Frequency Section */}
        <View style={{ justifyContent: 'center', alignItems: 'center', gap: 30, marginTop: 30, marginBottom: 30 }}>
          <Text style={styles.blackText}>Meal Frequency</Text>
          <View style={styles.boxContainer}>
            <NumberBox
              option="Meals"
              initialValue={mealsPerDay}
              onSave={(quantity) => setMealsPerDay(quantity)}
            />
            <Meals />
          </View>
        </View>

        {/* Water Intake Section */}
        <View style={{ justifyContent: 'center', alignItems: 'center', gap: 30, marginTop: 30 }}>
          <Text style={styles.blackText}>Water Intake</Text>
          <View style={styles.boxContainer}>
            <NumberBox
              option="Liters"
              initialValue={litersPerDay}
              onSave={(quantity) => setLitersPerDay(quantity)}
            />
            <Liters />
          </View>
        </View>

        {/* Submit Button */}
        <View style={{ width: '70%', justifyContent: 'center', alignSelf: 'center', marginTop: 30 }}>
          <CustomButton text="Submit" onPress={handleSubmit} disabled={isButtonDisabled} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    gap: 20,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  topBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
    marginBottom: '30%',
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
    padding: 30,
    width: '65%',
  },
});

export default FoodandDietS;
