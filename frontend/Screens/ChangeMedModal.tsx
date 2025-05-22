import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Dropdownlong from './Dropdownlong';
import NumberBox from './Numberbox';
import Pillsbox from './pillsbox';

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
  options: { key: string; value: string }[];
  placeholder: string;
  showType?: boolean;
};

const ChangeMedModal = ({
  visible,
  title,
  title2,
  onClose,
  onSelect,
}: Props) => {
  const [substance, setSubstance] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [pills, setPills] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [showSecondPart, setShowSecondPart] = useState(false);


  const handleConfirm = () => {
    setSubstance('');
    setQuantity(0);
    setPills(0);
    setSelectedFrequency('');
    setShowSecondPart(false);
    onClose();
  };

  const handleSaveQuantity = (newValue: number, option: string) => {
    if (option === 'Quantity') {
      setQuantity(newValue);
    } else if (option === 'Pills') {
      setPills(newValue);
    }
  };

  const handleGoBack = () => {
    setShowSecondPart(false);
    setSelectedFrequency('');
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseIcon}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          {!showSecondPart && (
            <>
              <Dropdownlong
                options={[
                  { key: 'rarely', value: 'Rarely' },
                  { key: 'as_needed', value: 'As Needed' },
                  { key: 'daily', value: 'Daily' },
                ]}
                setSelected={(value) => {
                  setSelectedFrequency(value);
                }}
              />

              {selectedFrequency === 'daily' && (
                <TouchableOpacity
                  onPress={() => setShowSecondPart(true)}
                  style={styles.goBackButton}
                >
                  <Text style={styles.goBackText}>Next</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {showSecondPart && (
            <>
              <Text style={styles.title}>{title2}</Text>
              <View style={styles.boxContainer}>
                <NumberBox option="Quantity" onSave={handleSaveQuantity} initialValue={quantity} />
                <Text style={{ fontSize: 70, color: 'white' }}>.</Text>
                <NumberBox option="Pills" onSave={handleSaveQuantity} initialValue={pills} />
                <Pillsbox />
              </View>

              <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
                <Text style={styles.goBackText}>Go Back</Text>
              </TouchableOpacity>
            </>
          )}

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
    gap: 20,
    backgroundColor: '#F2D6FF',
    padding: 25,
    borderRadius: 15,
    width: '90%',
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
  goBackButton: {
    backgroundColor: '#6B2A88',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  goBackText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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

export default ChangeMedModal;
