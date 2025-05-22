import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import NumberBox from './Numberbox';
import Dropdownlong from './Dropdownlong';  // Include Dropdownlong if necessary
import Qttyday from './qttyday';

type SubstanceEntry = {
  substance: string;
  quantity: number;
  drinkType: string;
};

type Props = {
  visible: boolean;
  title: string;
  title2: string;
  onClose: () => void;
  onSelect: (entry: SubstanceEntry) => void;
  options?: { key: string; value: string }[];  // Optional dropdown options for Narguileh
  placeholder?: string;  // Optional placeholder for Dropdownlong
  showType?: boolean;
};

const NarguilehModal = ({
  visible,
  title,
  title2,
  onClose,
  onSelect,
  options = [],
  placeholder = 'Select Substance',
  showType = true,
}: Props) => {
  const [substance, setSubstance] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [drinkType, setDrinkType] = useState('glass');

  useEffect(() => {
    if (!showType) {
      setSubstance('Narguileh');
      setDrinkType('session');
    }
  }, [showType]);

  const handleConfirm = () => {
    if (quantity > 0 && substance) {
      onSelect({ substance, quantity, drinkType });
    }

    setQuantity(0);
    setDrinkType('glass');
    onClose();
  };

  const handleSelectDrinkType = (type: string) => {
    setDrinkType(type.toLowerCase());
  };

  const handleSaveQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);  // Update quantity when it's changed in NumberBox
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          {/* Show substance dropdown only if showType is true */}
          {showType && (
            <Dropdownlong
              options={options}
              placeholder={placeholder}
              setSelected={setSubstance}
            />
          )}

          <Text style={styles.title}>{title2}</Text>

          <View style={styles.boxContainer}>
            {/* Pass quantity and onSave props to NumberBox */}
            <NumberBox option={substance} onSave={handleSaveQuantity} />
            <Qttyday/>

            {/* Show drink type options only if showType is true */}
            
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

export default NarguilehModal;
