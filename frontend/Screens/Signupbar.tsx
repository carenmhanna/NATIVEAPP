import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface SignupbarProps {
  currentStep: 1 | 2 | 3;
}

const Signupbar: React.FC<SignupbarProps> = ({ currentStep }) => {
  // Circle is filled purple if step <= currentStep, else grey
  const renderCircle = (step: number) => {
    const isFilled = step <= currentStep;
    return (
      <View style={isFilled ? styles.circleFilled : styles.circle}>
        <Text style={isFilled ? styles.stepTextFilled : styles.stepText}>{step}</Text>
      </View>
    );
  };

  // Lines are purple if currentStep > line index (line1 between 1-2, line2 between 2-3)
  const line1Color = currentStep >= 2 ? '#6B2A88' : '#ccc';
  const line2Color = currentStep === 3 ? '#6B2A88' : '#ccc';

  return (
    <View style={styles.bar}>
      {renderCircle(1)}
      <View style={[styles.line, { backgroundColor: line1Color }]} />
      {renderCircle(2)}
      <View style={[styles.line, { backgroundColor: line2Color }]} />
      {renderCircle(3)}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EABAFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleFilled: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6B2A88',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    color: '#6B2A88',
    fontWeight: '600',
    fontSize: 20,
  },
  stepTextFilled: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
  line: {
    width: 50,
    height: 6,
    marginHorizontal: 10,
    borderRadius: 3,
  },
});

export default Signupbar;
