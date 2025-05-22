import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import CustomButton from './CustomButton';
import MissedDoses from './misseddoses';
import ChangeMedModal from './ChangeMedModal';
import RoundRadioButtons from './RoundRadioButtons';
import { useStep } from './StepContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import SearchComponent from './SearchComponent';
import { BASE_URL } from '../config';

const MedicationAdherenceS = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [showMissedDosesModal, setShowMissedDosesModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [medicationAnswers, setMedicationAnswers] = useState({
    onTime: '',
    missedDoses: '',
  });

  type SubstanceEntry = {
    substance: string;
    quantity: number;
    drinkType: string;
  };

  const [missedDosesQuantity, setMissedDosesQuantity] = useState(0);
  const [missedDosesQuantityOnly, setMissedDosesQuantityOnly] = useState(0);
  const [missedDosesPills, setMissedDosesPills] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState('');

  const [medicationList, setMedicationList] = useState<{ name: string; id: string }[]>([]);
  const [new_meds, setNewMeds] = useState<any[]>([]); // Store full medication objects
  const [originalMeds, setOriginalMeds] = useState<any[]>([]); // Track original meds for comparison

  const [isEditing, setIsEditing] = useState(false);

  // Add Medication (Signup3 style)
  const [showAddMedInputs, setShowAddMedInputs] = useState(false);
const { selectedDate, setDailyLog, setStepValue } = useStep();

  // Fetch medication list from backend
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log("Error", "No authentication token found.");
          return;
        }
        // Decode user ID from JWT
        const decoded: any = jwtDecode(token!);
        const userId = decoded.id;

        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const user = await response.json();

        if (user.medication && Array.isArray(user.medication)) {
          // Assign a unique id to each medication
          const medsWithId = user.medication.map((med: any) => {
            const id = Math.random().toString(36).substr(2, 9);
            return { ...med, id };
          });
          setNewMeds(medsWithId); // Save full medication objects with id
          setOriginalMeds(medsWithId); // Track original
          setMedicationList(
            medsWithId.map((med: any) => ({
              name: med.medication_name,
              id: String(med.id),
            }))
          );
        }
      } catch (error) {
        console.log('Failed to fetch medications:', error);
      }
    };

    fetchMedications();
  }, []);

  const handleSelect = (question: string, answer: string) => {
    setMedicationAnswers((prevState) => ({
      ...prevState,
      [question]: answer,
    }));

    if (question === 'missedDoses' && answer === 'Yes') {
      setShowMissedDosesModal(true);
    }
  };

  const handleMissedDosesSave = (entry: { quantity: number, pills: number }) => {
    const combinedValue = entry.quantity + (entry.pills / 10);
    setMissedDosesQuantity(combinedValue);
    setMissedDosesQuantityOnly(entry.quantity);
    setMissedDosesPills(entry.pills);
    setShowMissedDosesModal(false);
  };

  const handleDeleteMedication = (id: string) => {
    setMedicationList(medicationList.filter(med => String(med.id) !== id));
    setNewMeds(prev => {
      const updated = prev.filter(med => med.id !== id);
      console.log('Updated new_meds:', updated);
      return updated;
    });
  };

  // --- Add Medication (Signup3 style, using SearchComponent's modal for freq/dose) ---
  // This will receive an array of { medication, dose, frequency }
  const handleSearchComponentData = (data: any[]) => {
    if (!data || data.length === 0) return;

    // Find new meds that are not already in new_meds (by medication_name, dose, frequency)
    const newOnes = data.filter(
      (med) =>
        !new_meds.some(
          (m) =>
            (m.medication_name === (med.medication_name || med.medication)) &&
            m.dose === med.dose &&
            m.frequency === med.frequency
        )
    );

    // Add unique id to each new one, and ensure only medication_name is used
    const medsWithId = newOnes.map((med) => ({
      medication_name: med.medication_name || med.medication,
      dose: med.dose,
      frequency: med.frequency,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setNewMeds((prev) => {
      const updated = [...prev, ...medsWithId];
      console.log('Updated new_meds:', updated);
      return updated;
    });

    setMedicationList((prev) => [
      ...prev,
      ...medsWithId.map((med) => ({
        name: med.medication_name,
        id: med.id,
      })),
    ]);

    setShowAddMedInputs(false);
  };

  // When "Change Medication List" is clicked
  const handleChangeMedicationList = () => {
    setIsEditing(true);
    console.log('Current full medication objects:', new_meds); // Log to terminal
  };

  const isFormComplete = medicationAnswers.onTime && medicationAnswers.missedDoses;

  // Compare meds for update logic
  const medsAreEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortFn = (x: any, y: any) =>
      (x.medication_name + x.dose + x.frequency).localeCompare(
        y.medication_name + y.dose + y.frequency
      );
    const aSorted = [...a].sort(sortFn);
    const bSorted = [...b].sort(sortFn);
    return aSorted.every(
      (med, i) =>
        med.medication_name === bSorted[i].medication_name &&
        med.dose === bSorted[i].dose &&
        med.frequency === bSorted[i].frequency
    );
  };

  // --- SUBMIT FUNCTION ---
  const submitMedicationAdherence = async () => {
    const token = await AsyncStorage.getItem('token');

    // 1. Update user meds if changed
    if (!medsAreEqual(new_meds, originalMeds)) {
      try {
        if (!token) {
          console.log("Error", "No authentication token found.");
          return;
        }
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;
        const medsToSave = new_meds.map(({ id, ...rest }) => rest);

        await fetch(`${BASE_URL}/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ medication: medsToSave }),
        }).then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            console.log("Medication list updated", JSON.stringify(data));
            setOriginalMeds(new_meds); // Update originalMeds to new state
            navigation.navigate('Step7');
          } else {
            console.log("Error", data.error || "Failed to update medication list.");
            return;
          }
        });
      } catch (err) {
        console.log("Error", "Failed to update medication list.");
        return;
      }
    }

    // 2. Always log medication adherence
    let missedMedArray: { medication_name: string; quantity_missed: number }[] = [];
    if (medicationAnswers.missedDoses === "Yes") {
      missedMedArray = medicationList
        .filter(med => missedDosesQuantityOnly > 0 || missedDosesPills > 0)
        .map(med => ({
          medication_name: med.name,
          quantity_missed: missedDosesQuantityOnly + missedDosesPills / 10,
        }));
    }

    const payload = {
      log_date: selectedDate,
      med_taken_on_time: medicationAnswers.onTime === "Yes",
      prm_med: {
        quantity: selectedFrequency ? Number(selectedFrequency) : undefined,
      },
      missed_med: missedMedArray,
    };

    try {
      const response = await fetch(`${BASE_URL}/medication-adherence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
       console.log('Success', 'Medication adherence log saved!');

// Save to global daily log
setDailyLog((prev: any) => ({
  ...prev,
  medication_adherence: {
    onTime: medicationAnswers.onTime,
    missedDoses: medicationAnswers.missedDoses,
    missedDosesQuantity,
    missedDosesPills,
    // add other relevant fields here...
  },
  date: selectedDate,
}));

// Optionally mark step as completed if using step logic
setStepValue('medicationAdherence', true);

// Reset local states if needed
setMedicationAnswers({ onTime: '', missedDoses: '' });
setMissedDosesQuantity(0);
setMissedDosesPills(0);

// Navigate if needed
navigation.navigate('Step7');

      } else {
        console.log("Error", data.error || "Failed to log medication adherence");
      }
    } catch (err) {
      console.log("Network error", "Could not connect to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Step7')}
            style={{ padding: 20 }} // Increase padding for easier touch
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Expands touch area
          >
            <Image source={require("./Loginpics/vector.png")} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.purpleText}>Medication</Text>
            <Text style={styles.purpleText}>Adherence</Text>
          </View>
        </View>

        {/* Move these sections to the top */}
        <View style={styles.sectionContainer}>
          <Text style={styles.blackText}>Medication</Text>
          <Text style={styles.blackText}>taken on time</Text>
          <RoundRadioButtons
            options={['Yes', 'No']}
            selectedOption={medicationAnswers.onTime}
            onSelect={(answer) => handleSelect('onTime', answer)}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.blackText}>Missed doses</Text>
          <RoundRadioButtons
            options={['Yes', 'No']}
            selectedOption={medicationAnswers.missedDoses}
            onSelect={(answer) => handleSelect('missedDoses', answer)}
          />
        </View>

        {/* Medication List Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.purpleText2}>Medication List</Text>
          <View style={styles.medicationList}>
            {medicationList.length === 0 && (
              <Text style={{ color: '#888', fontStyle: 'italic' }}>No medications added yet.</Text>
            )}
            {medicationList.map((med) => (
              <Text key={med.id}>{med.name}</Text>
            ))}
          </View>

          {/* Add Medication Button */}
          {!showAddMedInputs && (
            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 10, marginBottom: 10 }]}
              onPress={() => setShowAddMedInputs(true)}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Add Medication</Text>
            </TouchableOpacity>
          )}

          {/* Add Medication Inputs (Signup3 style, with SearchComponent modal for freq/dose) */}
          {showAddMedInputs && (
            <View style={{ width: '100%' }}>
              <SearchComponent
                setSelectedOptions={() => {}}
                setSelectedDataOutside={handleSearchComponentData}
              />
              <TouchableOpacity
                style={[styles.cancelButton, { marginTop: 10 }]}
                onPress={() => setShowAddMedInputs(false)}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Change Medication List Button */}
          <TouchableOpacity onPress={handleChangeMedicationList}>
            <Text style={styles.changeText}>Change Medication List</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Section */}
        {isEditing && (
          <View style={styles.editSection}>
            {medicationList.map((med) => (
              <View key={med.id} style={styles.medicationItem}>
                <Text>{med.name}</Text>
                {/* Only show Delete, remove Edit */}
                <TouchableOpacity onPress={() => handleDeleteMedication(String(med.id))}>
                  <Text style={styles.changeText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Close button to exit edit mode */}
            <TouchableOpacity
              style={[styles.cancelButton, { marginTop: 20 }]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>

            <ChangeMedModal
              visible={isModalVisible}
              title="Frequency"
              title2="Quantity"
              onClose={() => setIsModalVisible(false)}
              onSelect={(entry: SubstanceEntry) => {
                setSelectedFrequency(entry.substance);
              }}
              options={[
                { key: 'Rarely', value: 'Rarely' },
                { key: 'As needed', value: 'As needed' },
                { key: 'Daily', value: 'Daily' }
              ]}
              placeholder="Choose a frequency"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <CustomButton
            text="Submit"
            onPress={submitMedicationAdherence}
            disabled={!isFormComplete}
          />
        </View>

        <MissedDoses
          visible={showMissedDosesModal}
          title="Number of Pills Missed"
          onClose={() => setShowMissedDosesModal(false)}
          onSelect={handleMissedDosesSave}
          missedDosesQuantityOnly={missedDosesQuantityOnly}
          missedDosesPills={missedDosesPills}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: 10,
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  topBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  purpleText: {
    fontSize: 28,
    color: '#6B2A88',
    fontWeight: '600',
  },
  image: {
    position: 'relative',
    right: 45,
    resizeMode: 'contain',
  },
  blackText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 24,
    marginBottom: 5,
  },
  purpleText2: {
    color: '#B766DA',
    fontWeight: '500',
    fontSize: 24,
    marginBottom: 5,
  },
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
    width: '100%',
  },
  medicationList: {
    backgroundColor: '#F1E1F1',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    marginVertical: 10,
  },
  editSection: {
    backgroundColor: '#F1E1F1',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    marginVertical: 10,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  changeText: {
    color: '#B766DA',
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#6B2A88',
    paddingVertical: 10,
    marginTop: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6B2A88',
    color: '#fff',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#fff',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MedicationAdherenceS;