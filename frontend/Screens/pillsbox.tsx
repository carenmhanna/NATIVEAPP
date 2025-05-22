import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Pillsbox = () => {
  return (
    <View>
    <LinearGradient
      colors={['#573565', '#B766DA']}
      start={{ x: -0.05, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBox}
    >
      <Text style={styles.text}>Pills</Text>
    </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBox: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Pillsbox;
