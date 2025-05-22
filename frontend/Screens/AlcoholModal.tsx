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
import Glasses from './glasses';
import Shots from './Shots';
import Qttyday from './qttyday';

type SubstanceEntryWithDrinkType = {
  substance: string;
  quantity: number;
  drinkType: string;
};

type SubstanceEntryWithoutDrinkType = {
  substance: string;
  quantity: number;
};

type Props = {
  visible: boolean;
  title: string;
  title2: string;
  onClose: () => void;
  onSelect: (entry: SubstanceEntryWithDrinkType | SubstanceEntryWithoutDrinkType) => void;
  options: { key: string; value: string }[];
  placeholder: string;
  showType?: boolean;
  prefill?: SubstanceEntryWithDrinkType | SubstanceEntryWithoutDrinkType | null;
};

const AlcoholModal = ({
  visible,
  title,
  title2,
  onClose,
  onSelect,
  options,
  placeholder,
  showType = true,
  prefill,
}: Props) => {
  const [substance, setSubstance] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [drinkType, setDrinkType] = useState('glass');

  useEffect(() => {
    if (prefill) {
      setSubstance(prefill.substance);
      setQuantity(prefill.quantity);
      if (showType && 'drinkType' in prefill) {
        setDrinkType(prefill.drinkType);
      } else {
        setDrinkType('glass');
      }
    } else {
      setSubstance('');
      setQuantity(0);
      setDrinkType('glass');
    }
  }, [prefill, showType]);

  const handleConfirm = () => {
    if (quantity > 0 && substance) {
      if (showType) {
        onSelect({ substance, quantity, drinkType });
      } else {
        onSelect({ substance, quantity });
      }
    }
    setSubstance('');
    setQuantity(0);
    setDrinkType('glass');
    onClose();
  };

  const handleSaveQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleSelectDrinkType = (type: string) => {
    setDrinkType(type.toLowerCase());
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

       
            <Dropdownlong
              options={options}
              placeholder={placeholder}
              setSelected={setSubstance}
              selected={substance}
            />

          <Text style={styles.title}>{title2}</Text>
          <View style={styles.boxContainer}>
            <NumberBox option={substance} onSave={handleSaveQuantity} initialValue={quantity} />
            {showType ? (
  <View style={{ flexDirection: 'column', gap: 5 }}>
    <TouchableOpacity onPress={() => handleSelectDrinkType('glass')}>
      <Glasses selected={drinkType === 'glass'} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleSelectDrinkType('shot')}>
      <Shots selected={drinkType === 'shot'} />
    </TouchableOpacity>
  </View>
) : (
  <Qttyday />
)}

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

export default AlcoholModal;
