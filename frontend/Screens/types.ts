import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  Signuptwo: undefined;
  Step7: undefined;
  Signup3: { gender: string };
  Login1: undefined;
  SeizureTrackingS: undefined;
  NoSeizure: undefined;
  ProfileScreen: undefined;
  MyProfileScreen: undefined;
  SettingsScreen: undefined;
  EditProfileScreen: undefined;
  // Add any other screens to your navigation stack here as needed
};

export type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;
