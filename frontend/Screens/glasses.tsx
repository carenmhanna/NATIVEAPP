import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  selected: boolean;
};

const Glasses = ({ selected }: Props) => {
  if (selected) {
    return (
      <LinearGradient
        colors={['#6B2A88', '#B766DA'] as const}
        start={{ x: -0.05, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBox}
      >
        <Text style={styles.text}>Glasses</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.gradientBox, styles.greyBox]}>
      <Text style={styles.text}>Glasses</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBox: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  greyBox: {
    backgroundColor: '#CCCCCC',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Glasses;
