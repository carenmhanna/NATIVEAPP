import React, { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import CustomButton from './CustomButton';
import RoundRadioButtons from './RoundRadioButtons';
import PlusIcon from './PlusIcon';
import AlcoholModal from './AlcoholModal';
import NarguilehModal from './NarguilehModal';
import SubstanceModal from './SubstanceModal';
import { useStep } from './StepContext';
import { BASE_URL } from '../config';

type SubstanceEntry = {
  substance: string;
  quantity: number;
  drinkType?: string;
};

const AlcoholAndSubstance = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const [alcohol, setAlcohol] = useState('');
  const [smoking, setSmoking] = useState('');
  const [narguileh, setNarguileh] = useState('');
  const [caffeine, setCaffeine] = useState('');
  const [energyDrinks, setEnergyDrinks] = useState('');
  const [recreationalsubs, setRecreationalsubs] = useState('');

  const [alcoholDetails, setAlcoholDetails] = useState<string[]>([]);
  const [smokingDetails, setSmokingDetails] = useState<string[]>([]);
  const [narguilehDetails, setNarguilehDetails] = useState<string[]>([]);
  const [caffeineDetails, setCaffeineDetails] = useState<string[]>([]);
  const [energyDrinksDetails, setEnergyDrinksDetails] = useState<string[]>([]);
  const [recreationalsubsDetails, setRecreationalsubsDetails] = useState<string[]>([]);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTitle2, setModalTitle2] = useState('');
  const [modalType, setModalType] = useState('');
  const [modalOptions, setModalOptions] = useState<{ key: string; value: string }[]>([]);
  const [modalInitialValues, setModalInitialValues] = useState<SubstanceEntry | null>(null);


  const alcoholOptions = ["Vodka", "Beer", "Whiskey", "Gin", "Wine", "Arak", "Other"];
  const nicotineOptions = ["Icos", "Vape", "Cigar", "Cigarette", "Other"];
  const caffeineOptions = ["Coffee", "Tea",'Soft Drinks'];
  const energyDrinkOptions = ['Red Bull', 'Monster', 'XXL','Dark Blue'];
  const narguilehOptions = ['Grape Mint', 'Double Apple', 'Watermelon', 'Other'];
  const recreationalsubsOptions = ['free text'];
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const { setDailyLog, setStepValue, setStepNb } = useStep();

const handleEdit = (index: number, entry: string) => {
  const [substance, quantityStr] = entry.split(' | ');
  const quantityParts = quantityStr?.split(' ') || [];
  const quantity = parseInt(quantityParts[0], 10);
  const drinkType = quantityParts.slice(1).join(' ');

  setEditIndex(index);
  setModalTitle('Edit Substance');
  setModalTitle2('Edit Quantity');
  setModalType(modalType);

  const optionsMap: Record<string, string[]> = {
    'Alcohol': alcoholOptions,
    'Smoking': nicotineOptions,
    'Narguileh': narguilehOptions,
    'Caffeine': caffeineOptions,
    'Energy Drinks': energyDrinkOptions,
    'Recreational subs': recreationalsubsOptions,
  };

  setModalOptions(optionsMap[modalType].map(option => ({ key: option, value: option })));

  setModalInitialValues({
    substance,
    quantity,
    drinkType,
  });

  setIsModalVisible(true);
};

  const { selectedDate } = useStep();


const handleSubmit = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.log("Error", "User not authenticated.");
      return;
    }

    const decoded: any = jwtDecode(token);
    const userId = decoded.id || decoded.userId || decoded._id;
    const log_date = new Date();

    const parseDetails = (details: string[], typeKey: string) => {
      return details.map((entry) => {
        const [type, rest] = entry.split(' | ');
        const [quantityStr, unit] = rest.trim().split(' ');
        const quantity = parseInt(quantityStr);

        if (typeKey === 'alcohol') {
          return {
            alcoholType: type,
            quantity,
            unit: unit.toLowerCase(),
          };
        } else if (typeKey === 'smoking') {
          return { smokingType: type, quantity };
        } else if (typeKey === 'Caffeine') {
          return {
            CaffeineType: type,
            quantity,
          };
        } else if (typeKey === 'recreational_drug_use') {
          return { drugtype: type, quantity };
        } else if (typeKey === 'energy_drinks') {
          return {
            energy_drink_type: type,
            quantity,
          };
        }

        return {};
      });
    };

    const payload = {
      userId,
      log_date,
      alcohol: parseDetails(alcoholDetails, 'alcohol'),
      smoking: parseDetails(smokingDetails, 'smoking'),
      narguileh: {
        quantity:
          narguilehDetails.length > 0
            ? parseInt(narguilehDetails[0].split(' | ')[1])
            : 0,
      },
      Caffeine: parseDetails(caffeineDetails, 'Caffeine'),
      energy_drinks: parseDetails(energyDrinksDetails, 'energy_drinks'),
      recreational_drug_use: parseDetails(
        recreationalsubsDetails,
        'recreational_drug_use'
      ),
    };

    const response = await fetch(
      `${BASE_URL}/alcohol-and-substance-use/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (response.ok) {
        console.log('Success', 'Substance use log submitted!');
        setDailyLog((prev: any) => ({
  ...prev,
  alcohol_and_substance_use: {
    alcohol: parseDetails(alcoholDetails, 'alcohol'),
    smoking: parseDetails(smokingDetails, 'smoking'),
    narguileh: parseDetails(narguilehDetails, 'narguileh'),
    Caffeine: parseDetails(caffeineDetails, 'Caffeine'),
    energy_drinks: parseDetails(energyDrinksDetails, 'energy_drinks'),
recreational_drug_use: parseDetails(recreationalsubsDetails, 'recreational_drug_use'),
  },
  date: selectedDate,
}));


setStepValue('alcoholSubstanceUse', true);

        navigation.navigate('Step7');
      } else {
        console.log('Error', data?.error || 'Failed to log data');
      }
    } catch (e) {
      console.error('Invalid JSON response:', text);
      console.log('Error', 'Unexpected server response.');
    }
  } catch (err) {
    console.log('Network Error', 'Could not connect to the server.');
    console.error(err);
  }
};




  const openModal = (title: string, title2: string, type: string, options: string[]) => {
    setModalTitle(title);
    setModalTitle2(title2);
    setModalType(type);
    setModalOptions(options.map(option => ({ key: option, value: option })));
    setIsModalVisible(true);
  };

 const handleModalSelection = (selectedOption: SubstanceEntry) => {
  let formatted = '';

  if (modalType === 'Alcohol') {
    if (selectedOption.substance && selectedOption.quantity > 0 && selectedOption.drinkType) {
      formatted = `${selectedOption.substance} | ${selectedOption.quantity} ${selectedOption.drinkType}`;
    }
  } else {
    if (selectedOption.substance && selectedOption.quantity > 0) {
      formatted = `${selectedOption.substance} | ${selectedOption.quantity}`;
    }
  }

  if (!formatted) return;

  const updateDetails = (setFn: typeof setAlcoholDetails, prev: string[]) => {
    if (editIndex !== null) {
      const updated = [...prev];
      updated[editIndex] = formatted;
      setFn(updated);
    } else {
      setFn([...prev, formatted]);
    }
  };

  switch (modalType) {
    case 'Alcohol':
      updateDetails(setAlcoholDetails, alcoholDetails);
      break;
    case 'Smoking':
      updateDetails(setSmokingDetails, smokingDetails);
      break;
    case 'Narguileh':
      updateDetails(setNarguilehDetails, narguilehDetails);
      break;
    case 'Caffeine':
      updateDetails(setCaffeineDetails, caffeineDetails);
      break;
    case 'Energy Drinks':
      updateDetails(setEnergyDrinksDetails, energyDrinksDetails);
      break;
    case 'Recreational subs':
      updateDetails(setRecreationalsubsDetails, recreationalsubsDetails);
      break;
  }

  setIsModalVisible(false);
  setEditIndex(null);
  setModalInitialValues(null);
};



  const isButtonEnabled = () => {
    return (
      alcohol !== '' &&
      smoking !== '' &&
      narguileh !== '' &&
      caffeine !== '' &&
      energyDrinks !== '' &&
      recreationalsubs !== ''
    );
  };

  const renderSubstanceSection = (
    label: string,
    stateValue: string,
    setStateValue: React.Dispatch<React.SetStateAction<string>>,
    details: string[],
    setDetails: React.Dispatch<React.SetStateAction<string[]>>,
    modalTypeKey: string,
    options: string[]
  ) => (
    <View style={styles.sectionWrapper}>
      <Text style={styles.blackText}>{label}</Text>
      <RoundRadioButtons
        options={['Yes', 'No']}
        selectedOption={stateValue}
        onSelect={setStateValue}
      />
      <PlusIcon
        onPress={() => {
          if (modalTypeKey === 'Recreational subs') {
            setModalType('Recreational subs');
            setModalTitle('Substance Type');
            setModalTitle2('Enter Substance Details');
            setModalOptions(recreationalsubsOptions.map(option => ({ key: option, value: option })));
            setIsModalVisible(true);
          } else if (modalTypeKey === 'Narguileh') {
            setModalType('Narguileh');
            setModalTitle('Quantity');
            setModalTitle2('Enter Quantity');
            setModalOptions(narguilehOptions.map(option => ({ key: option, value: option })));
            setIsModalVisible(true);
          } else {
            openModal('Type', 'Quantity', modalTypeKey, options);
          }
        }}
        disabled={stateValue !== 'Yes'}
      />

      {details.length > 0 && (
  <View style={styles.entryList}>
    {details.map((entry, index) => (
      <View key={index} style={styles.entryContainer}>
        <Text style={styles.entryText}>{entry}</Text>
        <View style={styles.entryActions}>
          <TouchableOpacity onPress={() => handleEdit(index, entry)} style={styles.editButton}>
  <Text style={styles.editText}>Edit</Text>
</TouchableOpacity>

          <TouchableOpacity onPress={() => setDetails(prev => prev.filter((_, i) => i !== index))}>
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
  </View>
)}


    </View>
  );

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
          <View>
            <Text style={styles.purpleText}>Alcohol</Text>
            <Text style={styles.purpleText}>& Substance use</Text>
          </View>
        </View>

        <View style={styles.columnWrapper}>
          {renderSubstanceSection('Alcohol', alcohol, setAlcohol, alcoholDetails, setAlcoholDetails, 'Alcohol', alcoholOptions)}
          {renderSubstanceSection('Smoking or Nicotine Use', smoking, setSmoking, smokingDetails, setSmokingDetails, 'Smoking', nicotineOptions)}
          {renderSubstanceSection('Narguileh', narguileh, setNarguileh, narguilehDetails, setNarguilehDetails, 'Narguileh', narguilehOptions)}
          {renderSubstanceSection('Caffeine', caffeine, setCaffeine, caffeineDetails, setCaffeineDetails, 'Caffeine', caffeineOptions)}
          {renderSubstanceSection('Energy Drinks', energyDrinks, setEnergyDrinks, energyDrinksDetails, setEnergyDrinksDetails, 'Energy Drinks', energyDrinkOptions)}
          {renderSubstanceSection('Recreational Substance Use', recreationalsubs, setRecreationalsubs, recreationalsubsDetails, setRecreationalsubsDetails, 'Recreational subs', recreationalsubsOptions)}
        </View>

        <View style={styles.submitWrapper}>
          <CustomButton
      text="Submit"
      onPress={handleSubmit}
      disabled={!isButtonEnabled()}
    />
        </View>
      </ScrollView>

     <AlcoholModal
  visible={
    isModalVisible &&
    modalType !== 'Narguileh' &&
    modalType !== 'Recreational subs'
  }
  title={modalTitle}
  title2={modalTitle2}
  onClose={() => setIsModalVisible(false)}
  onSelect={handleModalSelection}
  options={modalOptions}
  placeholder="Select type"
  showType={modalType === 'Alcohol'}
  prefill={modalInitialValues}
/>

<NarguilehModal
  visible={isModalVisible && modalType === 'Narguileh'}
  title={modalTitle}
  title2={modalTitle2}
  onClose={() => setIsModalVisible(false)}
  onSelect={handleModalSelection}
  showType={false}
/>

<SubstanceModal
  visible={isModalVisible && modalType === 'Recreational subs'}
  title={modalTitle}
  title2={modalTitle2}
  onClose={() => setIsModalVisible(false)}
  onSelect={handleModalSelection}
  placeholder="Enter substance"
  prefilled={modalInitialValues}
/>




    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20, backgroundColor:'white',},
  topBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
    marginBottom: 70,
    backgroundColor:'white',
  },
  purpleText: {
    fontSize: 30,
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
  sectionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  columnWrapper: {
    flexDirection: 'column',
    gap: 80,
  },
  submitWrapper: {
    width: '70%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  entryList: {
    width: '100%',
    gap: 10,
    marginTop: 15,
  },
  entryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F2D6FF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  entryText: {
    color: '#6B2A88',
    fontWeight: '500',
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#B766DA',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#B766DA',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

export default AlcoholAndSubstance;


