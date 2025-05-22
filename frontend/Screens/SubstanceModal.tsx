import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import NumberBox from './Numberbox';
import Qttyday from './qttyday';

type SubstanceEntry = {
  substance: string;
  quantity: number;
};

type Props = {
  visible: boolean;
  title: string;
  title2: string;
  onClose: () => void;
  onSelect: (entry: SubstanceEntry) => void;
  placeholder: string;
prefilled?: SubstanceEntry | null
};

const SubstanceModal = ({
  visible,
  title,
  title2,
  onClose,
  onSelect,
  placeholder,
  prefilled,
}: Props) => {
  const [substance, setSubstance] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (prefilled) {
      setSubstance(prefilled.substance);
      setQuantity(prefilled.quantity);
    }
  }, [prefilled, visible]); // reset state when modal opens

  const handleConfirm = () => {
    if (quantity > 0 && substance.trim() !== '') {
      onSelect({ substance, quantity });
    }
    setSubstance('');
    setQuantity(0);
    onClose();
  };

  const handleSaveQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            value={substance}
            onChangeText={setSubstance}
            placeholder={placeholder}
            style={styles.input}
          />

          <Text style={styles.title}>{title2}</Text>
          <View style={styles.boxContainer}>
            <NumberBox
              option={substance}
              onSave={handleSaveQuantity}
              initialValue={quantity}
            />
            <Qttyday />
          </View>

          <TouchableOpacity onPress={handleConfirm} style={styles.closeButton}>
            <Image source={require('./CheckIcon.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: '#6B2A88', marginTop: 10 }]}>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
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
    width: '80%',
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
    gap: 10,
    backgroundColor: '#EABAFF',
    borderRadius: 20,
    padding: 30,
    width: '75%',
  },
  input: {
    backgroundColor: '#EABAFF',
    borderRadius: 10,
    padding: 10,
    width: '75%',
    fontSize: 16,
    color: '#6B2A88',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SubstanceModal;
