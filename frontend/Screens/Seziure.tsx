import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';

const { width } = Dimensions.get('window');

interface SeizureProps {
  date?: string; // optional date prop in ISO format (e.g. '2025-05-20')
  loggedDates?: string[]; // array of ISO date strings
}

const Seizure: React.FC<SeizureProps> = ({ date, loggedDates }) => {
  const navigation = useNavigation<AuthNavigationProp>();

  // Determine if the date is already logged (compare by date only, not time)
  const isLogged = loggedDates?.some(
    d => new Date(d).toDateString() === new Date(date ?? '').toDateString()
  );

  // Helper function to format date display
  const getDateDisplay = (inputDate?: string) => {
    if (!inputDate) return 'Today?';

    const input = new Date(inputDate);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const inputDay = new Date(input.getFullYear(), input.getMonth(), input.getDate());

    if (inputDay.getTime() === today.getTime()) return 'Today';
    if (inputDay.getTime() === yesterday.getTime()) return 'Yesterday';

    const isWednesday = input.getDay() === 3;

    const weekday = isWednesday
      ? input.toLocaleDateString('en-US', { weekday: 'short' }) // Wed
      : input.toLocaleDateString('en-US', { weekday: 'long' }); // Wednesday

    const dayNum = input.getDate();
    const month = input.toLocaleDateString('en-US', { month: 'short' });

    return `${weekday}, ${dayNum} ${month}`;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
      <View style={styles.circle}>
        {isLogged ? (
          <>
            <Text style={styles.txt}>Notify your</Text>
               <Text style={styles.txt}>emergency contact</Text>
           
               <Text style={styles.txt}>and complete your</Text>
               <Text style={styles.txt}>logs of the day.</Text>

           
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.whitebutton, { width: width * 0.38, height: width * 0.18, borderRadius: (width * 0.18) / 2 }]}
                onPress={() => navigation.navigate('Step7')}
              >
                <Text style={styles.whitetxt}>Log Your Day</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.txt}>Did you experience</Text>
            <Text style={styles.txt}>a seizure</Text>
            <Text style={styles.today}>{getDateDisplay(date)}</Text>

            <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
              <TouchableOpacity
                style={styles.whitebutton}
                onPress={() => navigation.navigate('SeizureTrackingS')}
              >
                <Text style={styles.whitetxt}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.whitebutton}
                onPress={() => navigation.navigate('Step7')}
              >
                <Text style={styles.whitetxt}>No</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  whitebutton: {
    backgroundColor: '#EABAFF',
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  today: {
    fontWeight: '500',
    fontSize: 38,
    marginTop: 10,
    color: '#EABAFF',
  },
  today2: {
    fontWeight: '500',
    fontSize: 24,
    marginTop: 10,
    color: 'white',
  },
  circle: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: '#6B2A88',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontWeight: '500',
    fontSize: 24,
    color: '#EABAFF',
    textAlign: 'center',
  },
  whitetxt: {
    fontWeight: '500',
    fontSize: 22,
    color: '#6B2A88',
  },
});

export default Seizure;
