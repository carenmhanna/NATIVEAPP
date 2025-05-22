import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, StyleSheet, Dimensions, PanResponderGestureState } from 'react-native';

const StressLevelSlider = () => {
  const [stressLevel, setStressLevel] = useState<number>(0);
  const sliderWidth = Dimensions.get('window').width * 0.8;
  const stepWidth = sliderWidth / 10;
  const sliderRef = useRef<View>(null);

  const handlePanResponderMove = (_: any, gestureState: PanResponderGestureState) => {
    const newPosition = Math.max(0, Math.min(sliderWidth, gestureState.moveX - (Dimensions.get('window').width * 0.1)));
    const newLevel = Math.round(newPosition / stepWidth);
    setStressLevel(newLevel);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: () => {
      },
    })
  ).current;

  const getEmoji = (level: number): string => {
    const emojis = ['😊', '🙂', '😐', '😕', '😟', '😠', '😡', '🤯', '💀', '🔥', '☠️'];
    return emojis[Math.min(level, emojis.length - 1)];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stress Level</Text>
      
      <View style={styles.sliderContainer} ref={sliderRef}>
        {/* Slider track */}
        <View style={styles.track}>
          {/* Active track */}
          <View style={[styles.activeTrack, { width: `${stressLevel * 10}%` }]} />
        </View>
        
        {/* Slider thumb */}
        <View 
          style={[
            styles.thumb, 
            { left: `${stressLevel * 10}%` }
          ]} 
          {...panResponder.panHandlers}
        >
          <Text style={styles.thumbText}>{getEmoji(stressLevel)}</Text>
        </View>
        
        {/* Labels */}
        <View style={styles.labelsContainer}>
          {[...Array(11)].map((_, i) => (
            <Text key={i} style={styles.label}>{i}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  sliderContainer: {
    width: '80%',
    height: 60,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    position: 'relative',
  },
  activeTrack: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    top: -18,
    marginLeft: -20,
  },
  thumbText: {
    fontSize: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
});

export default StressLevelSlider;