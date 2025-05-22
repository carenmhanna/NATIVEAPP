import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Dropdownlong from './Dropdownlong';
import NumberBox from './Numberbox';
import Hour from './hour';
import RoundRadioButtons from './RoundRadioButtons';
import Minutes from './minutes';

type WorkoutEntry = {
  name: string;
  duration: number; // in minutes
  intensity: string;
};

type Props = {
  visible: boolean;
  title: string;
  title2: string;
  onClose: () => void;
  onSelect: (entry: WorkoutEntry) => void;
  options: { key: string; value: string }[];
  placeholder: string;
  showType?: boolean;
};

const PhysicalModal = ({
  visible,
  title,
  title2,
  onClose,
  onSelect,
  options,
  placeholder,
  showType = true,
}: Props) => {
  const [substance, setSubstance] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [emotionalEvent, setEmotionalEvent] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);

  const handleSaveQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);  // Update quantity when it's changed in NumberBox
  };

  const handleConfirm = () => {
    if (substance && quantity > 0 && emotionalEvent) {
      const entry: WorkoutEntry = {
        name: substance,
        duration: quantity, // Here, you can convert minutes if necessary
        intensity: emotionalEvent,
      };

      // Add new entry to the list of workouts
      setWorkouts((prevWorkouts) => [...prevWorkouts, entry]);
      onSelect(entry);  // Pass the data back to parent
    }

    setSubstance('');
    setQuantity(0);
    setEmotionalEvent('');
    onClose();
  };

  const handleDelete = (index: number) => {
    // Delete the workout entry by index
    setWorkouts((prevWorkouts) => prevWorkouts.filter((_, i) => i !== index));
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <Text style={styles.title}>{title}</Text>

          {showType && (
            <Dropdownlong
              options={options}
              placeholder={placeholder}
              setSelected={setSubstance}
            />
          )}

          <Text style={styles.title}>{title2}</Text>
          <View style={styles.boxContainer}>
            <NumberBox option={substance} onSave={handleSaveQuantity} />
            <Hour />
            <NumberBox option={substance} onSave={handleSaveQuantity} />
            <Minutes />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.title}>Intensity Level</Text>
            <RoundRadioButtons
              options={['Low', 'Moderate', 'High']}
              selectedOption={emotionalEvent}
              onSelect={setEmotionalEvent}
            />
          </View>

          <TouchableOpacity onPress={handleConfirm} style={styles.closeButton}>
            <Image source={require('./CheckIcon.png')} />
          </TouchableOpacity>

           <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: '#6B2A88', marginTop: 10 }]}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
                    </TouchableOpacity>
        </View>

        {/* Render Workouts List */}
        <View style={styles.workoutList}>
          {workouts.map((workout, index) => (
            <View key={index} style={styles.workoutEntry}>
              <Text style={styles.workoutText}>
                {workout.name} | {workout.duration} | {workout.intensity}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#6B2A888C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSection: {
    width: '90%',
    alignItems: 'center',
    gap: 10,
    minHeight: 120,
  },
  container: {
    gap: 10,
    backgroundColor: '#F2D6FF',
    padding: 25,
    borderRadius: 15,
    width: '95%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#B766DA',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#6B2A88',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EABAFF',
    borderRadius: 20,
    padding: 40,
    width: '110%',
  },
  workoutList: {
    marginTop: 20,
    width: '90%',
  },
  workoutEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  workoutText: {
    fontSize: 16,
    color: '#4F2A6A',
  },
  deleteButton: {
    backgroundColor: '#F2D6FF',
    padding: 5,
    borderRadius: 15,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default PhysicalModal;
