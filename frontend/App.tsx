import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
enableScreens();

import { StepProvider } from './Screens/StepContext';

import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import Step7 from './Screens/Step7';
import Signup3 from './Screens/Signup3';
import Login1 from './Screens/Login1';
import MedicationAdherenceS from './Screens/MedicationAdherenceS';
import MenstrualCycleS from './Screens/MenstrualCycleS';
import PhysicalActivityS from './Screens/PhysicalActivityS';
import FoodandDietS from './Screens/FoodandDietS';
import AlcoholAndSubstance from './Screens/AlcoholAndSubstance';
import SeizureTrackingS from './Screens/SeizureTracking';
import MentalHealth from './Screens/MentalHealth';
import Seizure from './Screens/Seziure';  // double-check filename spelling here
import Signuptwo from './Screens/Signuptwo';
import EditProfileScreen from './Screens/EditProfileScreen';
import MyProfileScreen from './Screens/MyProfileScreen';
import SettingsScreen from './Screens/SettingsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import SleepAndFatigue from './Screens/SleepAndFatigue';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StepProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="LoginScreen"  // set your initial route here
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login1" component={Login1} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="SleepAndFatigue" component={SleepAndFatigue} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="MentalHealth" component={MentalHealth} />
            <Stack.Screen name="Signuptwo" component={Signuptwo} />
            <Stack.Screen name="PhysicalActivityS" component={PhysicalActivityS} />
            <Stack.Screen name="Signup3" component={Signup3} />
            <Stack.Screen name="AlcoholAndSubstance" component={AlcoholAndSubstance} />
            <Stack.Screen name="SeizureTrackingS" component={SeizureTrackingS} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="Step7" component={Step7} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
            <Stack.Screen name="FoodandDietS" component={FoodandDietS} />
            <Stack.Screen name="MenstrualCycleS" component={MenstrualCycleS} />
            <Stack.Screen name="MedicationAdherenceS" component={MedicationAdherenceS} />
            <Stack.Screen name="Seizure" component={Seizure} />
          </Stack.Navigator>
        </NavigationContainer>
      </StepProvider>
    </SafeAreaProvider>
  );
}
