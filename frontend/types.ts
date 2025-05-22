import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  Signuptwo: {
    first_name: string;
    last_name: string;
    password: string;
    email: string;
    phone: string;
  };
  Step7: undefined;
  YesSeizure:undefined;
  MenstrualCycleS:undefined;
Signup3: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  date_of_birth: string; // Pass as ISO string
  gender: string;
  seizureTypes: string[];
 
};
 
  Login1: undefined;
  SeizureTrackingS: undefined;
  Seizure:undefined;
  NoSeizure: undefined;
  SettingsScreen:undefined;
  EditProfileScreen:undefined;
  MyProfileScreen:undefined;
  // Add any other screens to your navigation stack here as needed
};

export type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;
