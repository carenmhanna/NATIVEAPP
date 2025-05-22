import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NumberBox from './Numberbox';
import SleepQualitySelector from './SleepQualitySelector';
import { BACKEND_IP } from '../config';

type NapType = {
  start: string;
  start_unit: 'AM' | 'PM';
  end: string;
  end_unit: 'AM' | 'PM';
  sleepQuality?: number;
};

type SleepModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (nap: NapType) => void;
  defaultData?: NapType | null;
};

const SleepModal: React.FC<SleepModalProps> = ({
  visible,
  onClose,
  onSubmit,
  defaultData = null,
}) => {
  const [fromQuantity, setFromQuantity] = useState(0);
  const [toQuantity, setToQuantity] = useState(0);
  const [sleepQualityN, setSleepQualityN] = useState<number>(0);

  const [fromPeriod, setFromPeriod] = useState<'AM' | 'PM'>('AM');
  const [toPeriod, setToPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (defaultData) {
      setFromQuantity(Number(defaultData.start.split(' ')[0]));
      setFromPeriod(defaultData.start_unit);
      setToQuantity(Number(defaultData.end.split(' ')[0]));
      setToPeriod(defaultData.end_unit);
      if (defaultData.sleepQuality !== undefined) {
        setSleepQualityN(defaultData.sleepQuality);
      }
    }
  }, [defaultData]);

  const handleSaveQuantity = (newQuantity: number, option: string) => {
    if (option === 'from') {
      setFromQuantity(newQuantity);
    } else if (option === 'to') {
      setToQuantity(newQuantity);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    const start = `${fromQuantity} ${fromPeriod}`;
    const end = `${toQuantity} ${toPeriod}`;
    onSubmit({
      start,
      start_unit: fromPeriod,
      end,
      end_unit: toPeriod,
      sleepQuality: sleepQualityN,
    });
    onClose();
  };

  const renderPeriodButton = (
    period: 'AM' | 'PM',
    selected: boolean,
    onPress: () => void
  ) => {
    const colors = selected
      ? ['#6B2A88', '#B766DA'] as const
      : ['#D3D3D3', '#A9A9A9'] as const;

    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          colors={colors}
          start={{ x: -0.05, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBox}
        >
          <Text style={styles.periodText}>{period}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseIcon}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={{ justifyContent: 'center', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
            <View style={styles.row}>
              <Text style={styles.purpleText}>From</Text>
              <NumberBox option="from" onSave={handleSaveQuantity} initialValue={fromQuantity} />
              <View style={styles.amPmColumn}>
                {renderPeriodButton('AM', fromPeriod === 'AM', () => setFromPeriod('AM'))}
                {renderPeriodButton('PM', fromPeriod === 'PM', () => setFromPeriod('PM'))}
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.purpleText}>To</Text>
              <NumberBox option="to" onSave={handleSaveQuantity} initialValue={toQuantity} />
              <View style={styles.amPmColumn}>
                {renderPeriodButton('AM', toPeriod === 'AM', () => setToPeriod('AM'))}
                {renderPeriodButton('PM', toPeriod === 'PM', () => setToPeriod('PM'))}
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.blackText}>Sleep Quality</Text>
            <SleepQualitySelector
              value={sleepQualityN}
              onChange={setSleepQualityN}
              getEmoji={(level) => {
  const emojis = ['🥱', '😴', '😓', '😟', '😐', '🙂', '😊', '😌', '😍', '🌟'];
  return emojis[level - 1];
}}

            />
          </View>

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.closeButton}>
            <Text style={{ color: '#fff' }}>Submit</Text>
          </TouchableOpacity>
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
  container: {
    gap: 20,
    backgroundColor: '#F2D6FF',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  purpleText: {
    fontSize: 30,
    color: '#6B2A88',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  blackText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 24,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6B2A88',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  item: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  gradientBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  periodText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  amPmColumn: {
    flexDirection: 'column',
    gap: 5,
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    color: '#6B2A88',
  },
});

export default SleepModal;
