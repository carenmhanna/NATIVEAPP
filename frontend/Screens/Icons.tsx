import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface IconsProps {
  text1: string;
  text2: string;
  imageSource: any;
  destination: string;
  filled: boolean; // true means not touchable + purple border
}

const Icons = ({ text1, text2, imageSource, destination, filled }: IconsProps) => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (filled) return; // disable press if filled
    setIsPressed(true);
    navigation.navigate(destination as never);
    setTimeout(() => setIsPressed(false), 300);
  };

  const textColor = isPressed ? '#FFFFFF' : '#6B298A';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={filled} // disables touch if filled
        activeOpacity={filled ? 1 : 0.7} // no opacity change if disabled
      >
        <View
          style={[
            styles.box,
            {
              backgroundColor: isPressed ? '#6B298A' : '#EABAFF',
              borderColor: filled ? '#6B298A' : 'transparent',
              borderWidth: filled ? 2 : 0,
            },
          ]}
        >
          <Text style={[styles.txt, { color: textColor }]}>{text1}</Text>
          <Text style={[styles.txt, { color: textColor }]}>{text2}</Text>
          <Image source={imageSource} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: width * 0.45,
    height: width * 0.4,
    backgroundColor: '#EABAFF',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  txt: {
    fontWeight: '500',
    fontSize: 24,
    color: '#6B298A', // default color, overridden dynamically
  },
});

export default Icons;
