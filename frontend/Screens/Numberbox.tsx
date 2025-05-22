import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

type NumberBoxProps = {
  option: string;
  onSave: (quantity: number, option: string) => void;
  initialValue?: number;
  maxValue?: number;
  step?: number; // Optional step prop
};

const NumberBox: React.FC<NumberBoxProps> = ({
  option,
  onSave,
  initialValue,
  maxValue,
  step = 1, // Default to 1 if not provided
}) => {
  const [value, setValue] = useState(initialValue ?? 0);

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const allowed25 = [0, 25, 50, 75];

  const increment = () => {
    if (step === 25) {
      const idx = allowed25.indexOf(value);
      if (idx < allowed25.length - 1) {
        const newVal = allowed25[idx + 1];
        setValue(newVal);
        onSave(newVal, option);
      }
      // else do nothing if already at 75
    } else if (maxValue === undefined || value + step <= maxValue) {
      const newVal = parseFloat((value + step).toFixed(2));
      setValue(newVal);
      onSave(newVal, option);
    }
  };

  const decrement = () => {
    if (step === 25) {
      const idx = allowed25.indexOf(value);
      if (idx > 0) {
        const newVal = allowed25[idx - 1];
        setValue(newVal);
        onSave(newVal, option);
      }
      // else do nothing if already at 0
    } else if (value - step >= 0) {
      const newVal = parseFloat((value - step).toFixed(2));
      setValue(newVal);
      onSave(newVal, option);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.numberBox}>
          <Text style={styles.number}>{value}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={increment} style={styles.button}>
            <Image source={require('./uparrow.png')} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={decrement} style={styles.button}>
            <Image source={require('./downarrow.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 30,
    width: 30,
  },
  box: {
    backgroundColor: '#EABAFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  numberBox: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderColor: '#B766DA',
    backgroundColor: '#F2D6FF',
    marginRight: 10,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B766DA',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginVertical: 5,
  },
});

export default NumberBox;