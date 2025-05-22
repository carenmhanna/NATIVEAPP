import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthNavigationProp } from '../types';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Bottombar = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute();

  const getActiveTab = () => {
    switch (route.name) {
      case 'Step7':
        return 'home';
      case 'Login1':
        return 'calendar';
      case 'ProfileScreen':
        return 'profile';
      default:
        return '';
    }
  };

  const activeTab = getActiveTab();

  return (
    <View style={styles.bar}>
      <TouchableOpacity onPress={() => navigation.navigate('Step7')}>
        <View style={[styles.iconWrapper, activeTab === 'home' && styles.active]}>
          <Icon name="home-outline" size={24} color={activeTab === 'home' ? '#6B2A88' : 'white'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login1')}>
        <View style={[styles.iconWrapper, activeTab === 'calendar' && styles.active]}>
          <Icon name="calendar-outline" size={24} color={activeTab === 'calendar' ? '#6B2A88' : 'white'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen' as never)}>
        <View style={[styles.iconWrapper, activeTab === 'profile' && styles.active]}>
          <Icon name="person-outline" size={24} color={activeTab === 'profile' ? '#6B2A88' : 'white'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#6B2A88',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: '90%',
    position: 'absolute',
    bottom: 30,
    left: '5%',
    right: '5%',
    ...Platform.select({
      ios: { paddingBottom: 15 },
      android: { paddingBottom: 10 },
    }),
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 30,
  },
  active: {
    backgroundColor: 'white',
  },
});

export default Bottombar;
