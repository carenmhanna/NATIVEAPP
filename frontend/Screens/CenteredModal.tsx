import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import NumberBox from './Numberbox';
import Dropdownlong from './Dropdownlong';
import Pillsbox from './pillsbox';

const { width, height } = Dimensions.get('window');

interface MissedDosesProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (doseOrEmpty: string | undefined, frequency: string, medName?: string) => void;
  other?: boolean;
  initialDose?: string;         // dose initiale (ex: "1.5")
  initialFrequency?: string;    // fréquence initiale (ex: "Daily")
  initialMedication?: string;   // nom de médicament initial
}

const CenteredModal: React.FC<MissedDosesProps> = ({
  isVisible,
  onClose,
  onSave,
  other = false,
  initialDose,
  initialFrequency,
  initialMedication,
}) => {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [frequency, setFrequency] = useState('');
  const [medName, setMedName] = useState('');

  useEffect(() => {
    if (isVisible) {
      const freq = initialFrequency || '';
      setFrequency(freq);

      setMedName(initialMedication || '');

      if (initialDose && freq === 'Daily') {
        const parts = initialDose.split('.');
        setValue1(parseInt(parts[0]) || 0);
        setValue2(parseInt(parts[1]) || 0);
      } else {
        setValue1(0);
        setValue2(0);
      }
    }
  }, [isVisible, initialDose, initialFrequency, initialMedication]);

  const handleSaveQuantity = (newValue: number, option: string) => {
    if (option === 'Box1') setValue1(newValue);
    else if (option === 'Box2') setValue2(newValue);
  };

  const handleConfirm = () => {
    let dose: string | undefined = undefined;
    if (frequency === 'Daily') {
      dose = value2 > 0 ? `${value1}.${value2}` : `${value1}`;
    }
    if (other) {
      onSave(dose, frequency, medName.trim());
    } else {
      onSave(dose, frequency);
    }
    onClose();
  };

  // Validation
  const isFrequencyValid = frequency.length > 0;
  const isMedNameValid = other ? medName.trim().length > 0 : true;
  const isDailyDoseValid = frequency === 'Daily' ? value1 >= 0 : true;

  const isFormValid = isFrequencyValid && isMedNameValid && isDailyDoseValid;

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Close button top right */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {other && (
              <View style={{ width: '100%', marginBottom: 20 }}>
                <Text style={styles.label}>Name of Medication</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter medication name"
                  value={medName}
                  onChangeText={setMedName}
                />
              </View>
            )}

            <View style={styles.dropdownSection}>
              <Text style={styles.label}>Frequency of Medication</Text>
              <Dropdownlong
                placeholder="Choose Frequency"
                options={[
                  { key: 'Daily', value: 'Daily' },
                  { key: 'As needed', value: 'As needed' },
                  { key: 'Rarely', value: 'Rarely' },
                ]}
                setSelected={setFrequency}
              />
            </View>

            {frequency === 'Daily' && (
              <>
                <Text style={styles.label}>Daily Dose</Text>
                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                  <NumberBox option="Box1" onSave={handleSaveQuantity} initialValue={value1} />
                  <Text style={{ color: 'white', fontSize: 56 }}>.</Text>
                  <NumberBox option="Box2" onSave={handleSaveQuantity} initialValue={value2} step={25} />
                  <View style={{ marginTop: 10 }}>
                    <Pillsbox />
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleConfirm}
              disabled={!isFormValid}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.grayButtonContainer}
              onPress={onClose}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 42, 136, 0.55)',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#EABAFF',
    borderRadius: 15,
    padding: 20,
    position: 'relative',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  dropdownSection: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#6B2A88',
    borderRadius: 12, // slightly more rounded
    borderWidth: 1,
    borderColor: '#4E1D74',
    width: 180,        // increased width
    alignSelf: 'center',
    marginTop: 14,     // slightly more space
    paddingVertical: 14, // increased height
  },
  grayButtonContainer: {
    backgroundColor: '#cccccc',
    borderRadius: 12, // slightly more rounded
    borderWidth: 1,
    borderColor: '#888888',
    width: 180,        // increased width
    alignSelf: 'center',
    paddingVertical: 14, // increased height
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#6B2A88',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
  },
});

export default CenteredModal;