import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import SleepQualitySelector from './SleepQualitySelector';
import SleepModal from './SleepModal';
import { useStep } from './StepContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumberBox from './Numberbox';
import { BACKEND_IP } from '../config';
import { BASE_URL } from '../config';

const SleepAndFatigue = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { setDailyLog, setStepValue, stepNb, setStepNb } = useStep();

  const [sleepQuality, setSleepQuality] = useState<number>(0);
  const [fatigue, setFatigue] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [naps, setNaps] = useState<
    { start: string; start_unit: "AM" | "PM"; end: string; end_unit: "AM" | "PM" }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [fromQuantity, setFromQuantity] = useState<number>(0);
  const [fromPeriod, setFromPeriod] = useState<'AM' | 'PM'>('AM');
  const [toQuantity, setToQuantity] = useState<number>(0);
  const [toPeriod, setToPeriod] = useState<'AM' | 'PM'>('AM');

  const handleSaveQuantity = (option: 'from' | 'to', value: number) => {
    if (option === 'from') setFromQuantity(value);
    else setToQuantity(value);
  };

  const renderPeriodButton = (
    label: 'AM' | 'PM',
    selected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.periodButton,
        { backgroundColor: selected ? '#6B2A88' : '#EABAFF' },
      ]}
    >
      <Text style={{ color: selected ? 'white' : '#6B2A88' }}>{label}</Text>
    </TouchableOpacity>
  );

  const handleDelete = (index: number) => {
    setNaps(naps.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleModalSubmit = (nap: {
    start: string;
    start_unit: "AM" | "PM";
    end: string;
    end_unit: "AM" | "PM";
  }) => {
    if (editIndex !== null) {
      const updated = [...naps];
      updated[editIndex] = nap;
      setNaps(updated);
      setEditIndex(null);
    } else {
      setNaps([...naps, nap]);
    }
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    // Validation: Ensure sleep start/end are set
    if (
      fromQuantity < 1 ||
      fromQuantity > 12 ||
      toQuantity < 1 ||
      toQuantity > 12
    ) {
      console.log('Error', 'Please select valid sleep start and end times (1-12).');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Error', 'No authentication token found.');
        return;
      }

      const formattedNaps = naps.map((nap) => ({
        nap_start: parseInt(nap.start),
        nap_start_unit: nap.start_unit,
        nap_end: parseInt(nap.end),
        nap_end_unit: nap.end_unit,
        sleep_quality: sleepQuality,
      }));

      const payload = {
        log_date: new Date().toISOString(),
        sleep_quality: sleepQuality,
        daytime_fatigue: fatigue,
        nap: formattedNaps,
        sleep_start: fromQuantity,
        sleep_start_unit: fromPeriod,
        sleep_end: toQuantity,
        sleep_end_unit: toPeriod,
      };

      console.log('Submitting payload:\n' + JSON.stringify(payload, null, 2));

      const response = await fetch(`${BASE_URL}/sleep-and-fatigue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }

      if (response.ok) {
        console.log('Success', 'Log saved!');
        setDailyLog((prev: any) => ({
          ...prev,
          sleep_and_fatigue: {
            sleep_quality: sleepQuality,
            daytime_fatigue: fatigue,
            naps,
            sleep_start: fromQuantity,
            sleep_start_unit: fromPeriod,
            sleep_end: toQuantity,
            sleep_end_unit: toPeriod,
            log_date: new Date().toISOString(),
          },
        }));

        setStepValue('sleepFatigue', true);
        setStepNb(stepNb + 1);
        navigation.navigate('Step7');
      } else {
        console.log('Error', data.error || 'Failed to save log');
      }
    } catch (error: any) {
      console.log('Submission error:', error);
      console.log('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Step7')}
            style={{ padding: 20 }} // Increase padding for easier touch
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Expands touch area
          >
            <Image source={require('./Loginpics/vector.png')} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.purpleText}>Sleep and Fatigue</Text>
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
          <View style={styles.row}>
            <Text style={styles.purpleText2}>From</Text>
           <NumberBox
  option="from"
  onSave={(quantity, option) => handleSaveQuantity(option as 'from' | 'to', quantity)}
  initialValue={fromQuantity}
  maxValue={12}
/>


            <View style={styles.amPmColumn}>
              {renderPeriodButton('AM', fromPeriod === 'AM', () => setFromPeriod('AM'))}
              {renderPeriodButton('PM', fromPeriod === 'PM', () => setFromPeriod('PM'))}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.purpleText2}>To</Text>
           <NumberBox
  option="to"
  onSave={(quantity, option) => handleSaveQuantity(option as 'from' | 'to', quantity)}
  initialValue={toQuantity}
  maxValue={12}
/>

            <View style={styles.amPmColumn}>
              {renderPeriodButton('AM', toPeriod === 'AM', () => setToPeriod('AM'))}
              {renderPeriodButton('PM', toPeriod === 'PM', () => setToPeriod('PM'))}
            </View>
          </View>
        </View>

        <View style={{justifyContent:'center',alignItems:'center',flexDirection:'column',gap:60,marginTop:20,}}>
 <View style={styles.item}>
          <Text style={styles.blackText}>Sleep Quality</Text>
          <SleepQualitySelector
            value={sleepQuality}
            onChange={setSleepQuality}
            getEmoji={(level) => {
              const emojis = ['🥱', '😴', '😓', '😟', '😐', '🙂', '😊', '😌', '😍', '🌟'];
              return emojis[level - 1];
            }}
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.blackText}>Daytime fatigue</Text>
          <SleepQualitySelector
            value={fatigue}
            onChange={setFatigue}
            getEmoji={(level) => {
              const emojis = ['🌟', '😍', '😌', '😊', '🙂', '😐', '😟', '😓', '😴', '🥱'];
              return emojis[level - 1];
            }}
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.blackText}>Nap</Text>
          <TouchableOpacity onPress={() => { setModalVisible(true); setEditIndex(null); }}>
            <Image source={require('./AlcoholPics/PlusButton.png')} />
          </TouchableOpacity>
          <View style={{ width: '90%', gap: 10 }}>
            {naps.map((nap, index) => (
              <View key={index} style={styles.napBox}>
                <Text style={styles.napText}>Nap {index + 1} | {nap.start} {nap.start_unit} - {nap.end} {nap.end_unit}</Text>
                <View style={styles.napButtons}>
                  <TouchableOpacity onPress={() => handleEdit(index)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(index)}>
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        </View>
       

        <View style={{ alignItems: 'center', marginVertical: 30 }}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {modalVisible && (
          <SleepModal
            visible={modalVisible}
            onClose={() => { setModalVisible(false); setEditIndex(null); }}
            onSubmit={handleModalSubmit}
            defaultData={editIndex !== null ? naps[editIndex] : null}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent:'center',
  },
  topBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
    marginBottom: 70,
    backgroundColor: 'white',
  },
  purpleText: {
    fontSize: 30,
    color: '#6B2A88',
    fontWeight: '600',
    textAlign: 'center',
  },
  purpleText2: {
    fontSize: 25,
    color: '#6B2A88',
    fontWeight: '600',
    textAlign: 'center',
  },
  image: {
    position: 'relative',
    right: 45,
  },
  blackText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 24,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 25,
    alignItems: 'center',
  },
  amPmColumn: {
    flexDirection: 'column',
    gap: 5,
  },
  item: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    marginTop: 30,
  },
  napBox: {
    backgroundColor: '#EABAFF',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  napText: {
    color: '#6B2A88',
    fontSize: 16,
  },
  napButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editText: {
    color: 'blue',
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#6B2A88',
    padding: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
  periodButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B2A88',
    alignItems: 'center',
  },
});

export default SleepAndFatigue;