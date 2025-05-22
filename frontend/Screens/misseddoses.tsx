import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import NumberBox from './Numberbox';
import Pillsbox from './pillsbox';

type MissedDosesProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSelect: (entry: { quantity: number; pills: number }) => void;
  missedDosesQuantityOnly: number;
  missedDosesPills: number;
};

const MissedDoses = ({
  visible,
  title,
  onClose,
  onSelect,
  missedDosesQuantityOnly,
  missedDosesPills,
}: MissedDosesProps) => {
  const [quantity, setQuantity] = useState(missedDosesQuantityOnly);
  const [pills, setPills] = useState(missedDosesPills);

  // Reset values each time modal is opened
  useEffect(() => {
    if (visible) {
      setQuantity(missedDosesQuantityOnly);
      setPills(missedDosesPills);
    }
  }, [visible, missedDosesQuantityOnly, missedDosesPills]);

  const handleSaveQuantity = (newValue: number, option: string) => {
    if (option === 'Quantity') {
      setQuantity(newValue);
    } else if (option === 'Pills') {
      setPills(newValue);
    }
  };

  const handleConfirm = () => {
    onSelect({ quantity, pills });
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.boxContainer}>
            <NumberBox option="Quantity" onSave={handleSaveQuantity} initialValue={quantity} />
            <Text style={{ fontSize: 70, color: 'white' }}>.</Text>
            <NumberBox option="Pills" onSave={handleSaveQuantity} initialValue={pills} />
            <Pillsbox />
          </View>

          <TouchableOpacity onPress={handleConfirm} style={styles.closeButton}>
            <Image source={require('./CheckIcon.png')} />
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
    backgroundColor: '#F2D6FF',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
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
    padding: 30,
    width: '110%',
  },
});

export default MissedDoses;
