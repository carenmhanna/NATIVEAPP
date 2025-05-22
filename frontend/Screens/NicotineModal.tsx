import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Dropdownlong from './Dropdownlong';
import NumberBox from './Numberbox';
import Qttyday from './qttyday';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSelect: (entry: [number, number]) => void; // [nicotineType, quantity]
  options: { key: string; value: string }[]; // nicotine types options
  placeholder: string;
  prefill?: [number, number] | null;
};

const NicotineModal = ({
  visible,
  title,
  onClose,
  onSelect,
  options,
  placeholder,
  prefill,
}: Props) => {
  const [type, setType] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (prefill) {
      setType(prefill[0]);
      setQuantity(prefill[1]);
    } else {
      setType(null);
      setQuantity(0);
    }
  }, [prefill]);

  const handleConfirm = () => {
    if (type !== null && quantity > 0) {
      onSelect([type, quantity]);
    }
    setType(null);
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

          <Dropdownlong
            options={options}
            placeholder={placeholder}
            setSelected={(key: string) => setType(Number(key))}
            selected={type !== null ? String(type) : ''}
          />

          <Text style={styles.title}>Quantity</Text>

          <View style={styles.boxContainer}>
            <NumberBox option={type !== null ? options.find(o => o.key === String(type))?.value || '' : ''} onSave={handleSaveQuantity} initialValue={quantity} />
              <Qttyday/>
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
});

export default NicotineModal;
