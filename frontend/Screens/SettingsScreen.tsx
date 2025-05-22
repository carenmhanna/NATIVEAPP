import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, useWindowDimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const scale = width / 375; // Base width used for scaling (iPhone X width)

  const [theme, setTheme] = useState<'Light' | 'Dark'>('Light');
  const [themeDropdownVisible, setThemeDropdownVisible] = useState(false);

  const [language, setLanguage] = useState<'English'>('English');
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

  const toggleThemeDropdown = () => setThemeDropdownVisible(!themeDropdownVisible);
  const toggleLanguageDropdown = () => setLanguageDropdownVisible(!languageDropdownVisible);

  const handleThemeSelect = (option: 'Light' | 'Dark') => {
    setTheme(option);
    setThemeDropdownVisible(false);
  };

  const handleLanguageSelect = (option: 'English') => {
    setLanguage(option);
    setLanguageDropdownVisible(false);
  };

  const styles = getStyles(scale);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24 * scale} color="#6B298A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Theme */}
      <View style={styles.row}>
        <Text style={styles.leftText}>Theme</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleThemeDropdown}>
          <Text style={styles.dropdownText}>{theme}</Text>
          <Icon name="chevron-down" size={18 * scale} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={themeDropdownVisible} animationType="fade">
        <Pressable style={styles.modalBackground} onPress={() => setThemeDropdownVisible(false)}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => handleThemeSelect('Light')}>
              <Text style={styles.dropdownOption}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleThemeSelect('Dark')}>
              <Text style={styles.dropdownOption}>Dark</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.separator} />

      {/* Language */}
      <View style={styles.row}>
        <Text style={styles.leftText}>Language</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleLanguageDropdown}>
          <Text style={styles.dropdownText}>{language}</Text>
          <Icon name="chevron-down" size={18 * scale} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={languageDropdownVisible} animationType="fade">
        <Pressable style={styles.modalBackground} onPress={() => setLanguageDropdownVisible(false)}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => handleLanguageSelect('English')}>
              <Text style={styles.dropdownOption}>English</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

const getStyles = (scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20 * scale,
      paddingTop: Platform.OS === 'ios' ? 60 * scale : 40 * scale,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30 * scale,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 22 * scale,
      color: '#6B298A',
      fontWeight: 'bold',
      marginRight: 24 * scale,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10 * scale,
    },
    leftText: {
      fontSize: 18 * scale,
      color: '#6B298A',
      fontWeight: '600',
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdownText: {
      fontSize: 16 * scale,
      marginRight: 5 * scale,
      color: '#4B5563',
    },
    separator: {
      height: 1,
      backgroundColor: '#DEA6F7',
      opacity: 0.3,
      marginVertical: 12 * scale,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dropdownMenu: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10 * scale,
      width: 120 * scale,
    },
    dropdownOption: {
      paddingVertical: 10 * scale,
      textAlign: 'center',
      color: '#6B298A',
      fontWeight: '600',
      fontSize: 16 * scale,
    },
  });
