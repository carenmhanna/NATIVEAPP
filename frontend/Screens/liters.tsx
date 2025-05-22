// ./liters.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Liters = () => {
  return (
    <View>
      <LinearGradient
        colors={['#573565', '#B766DA']}
        start={{ x: -0.05, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBox}
      >
        <Text style={styles.text}>liters</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Liters;
