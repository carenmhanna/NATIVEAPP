// SleepQualityTracker.tsx
import React, { useRef } from 'react';
import { View, Text, PanResponder, StyleSheet, Dimensions, PanResponderGestureState } from 'react-native';

interface SleepQualityTrackerProps {
  value: number; // current slider value (0-10)
  onChange: (val: number) => void; // callback on value change
  labels?: string[]; // optional labels for scale, default 0-10 numbers
  getEmoji?: (level: number) => string; // optional function to show emoji on thumb
}

const sliderWidth = Dimensions.get('window').width * 0.6;
const stepWidth = sliderWidth / 10;

const SleepQualitySelector: React.FC<SleepQualityTrackerProps> = ({ value, onChange, labels, getEmoji }) => {
  const handlePanResponderMove = (_: any, gestureState: PanResponderGestureState) => {
    const newPosition = Math.max(0, Math.min(sliderWidth, gestureState.moveX - (Dimensions.get('window').width * 0.2)));
    const newLevel = Math.round(newPosition / stepWidth);
    onChange(newLevel);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: () => {},
    })
  ).current;

  // Default labels: 0 to 10 if none passed
  const renderedLabels = labels && labels.length > 0 ? labels : [...Array(11)].map((_, i) => i.toString());

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.track}>
        <View style={[styles.activeTrack, { width: `${value * 10}%` }]} />
      </View>
      <View style={[styles.thumb, { left: `${value * 10}%` }]} {...panResponder.panHandlers}>
        <Text style={styles.thumbText}>{getEmoji ? getEmoji(value) : value}</Text>
      </View>
      <View style={styles.labelsContainer}>
        {renderedLabels.map((label, i) => (
          <Text key={i} style={styles.label}>{label}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 10,
    backgroundColor: '#E9B7FF',
    borderRadius: 5,
    position: 'relative',
  },
  activeTrack: {
    height: 10,
    backgroundColor: '#893FAA',
    borderRadius: 5,
  },
  thumb: {
    position: 'absolute',
    top: -10,
    width: 30,
    height: 30,
    backgroundColor: '#6B2A88',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B09ACD',
  },
  thumbText: {
    fontSize: 18,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#B766DA',
    textAlign: 'center',
    flex: 1,
  },
});

export default SleepQualitySelector;
