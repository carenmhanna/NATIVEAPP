import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Adjust path if needed
import { BASE_URL } from '../config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const MyProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadTokenAndUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const decoded: any = jwtDecode(storedToken);
          setUserId(decoded.id || decoded._id); // Adjust according to your token payload
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      }
    };
    loadTokenAndUserId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) return;
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, token]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#6B2A88" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>Failed to load user data.</Text>
      </SafeAreaView>
    );
  }

  // Format medication list if it's an array
  const medicationList = Array.isArray(userData.medication)
    ? userData.medication.map((med: any, idx: number) => {
        if (med.medication_name === "Other" && med.other_medication_name) {
          return `${med.other_medication_name} (${med.dose || ''}, ${med.frequency})`;
        }
        return `${med.medication_name}${med.dose ? ` (${med.dose}` : ''}${med.dose ? `, ${med.frequency})` : med.frequency ? ` (${med.frequency})` : ''}`;
      }).join('\n')
    : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>My Profile</Text>
          <View style={styles.arrowSpacer} />
        </View>

        {/* Profile Info Row */}
        <View style={styles.profileRow}>
          <Image
            source={require('./ProfileScreenpics/profile-placeholder.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.nameSection}>
            <Text style={styles.fullName}>
              {userData.first_name || ''} {userData.last_name || ''}
            </Text>
            <Text style={styles.username}>{userData.email ? `@${userData.email.split('@')[0]}` : ''}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfileScreen' as never)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Thick Separator */}
        <View style={styles.separator} />

        {/* Info Fields */}
        <FieldRow label="Name" value={`${userData.first_name || ''} ${userData.last_name || ''}`} />
        <ThinSeparator />
        <FieldRow label="Email" value={userData.email || ''} />
        <ThinSeparator />
        <FieldRow label="Mobile Number" value={userData.phone || ''} />
        <ThinSeparator />
        <FieldRow label="Date of Birth" value={userData.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : ''} />
        <ThinSeparator />
        <FieldRow label="Gender" value={userData.gender || ''} />
        <ThinSeparator />
        <FieldRow label="Type of Seizure" value={userData.seizureTypes || ''} />
        <ThinSeparator />
        <FieldRow label="Medication List" value={medicationList || ''} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Field Row
const FieldRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue} numberOfLines={2} ellipsizeMode="tail">
      {value}
    </Text>
  </View>
);

// Thin separator
const ThinSeparator = () => <View style={styles.thinSeparator} />;

export default MyProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  backArrow: {
    fontSize: 28,
    color: '#6B2A88',
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: 22,
    color: '#6B298A',
    fontWeight: 'bold',
  },
  arrowSpacer: {
    width: 28, // Matches size of back arrow for balance
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  nameSection: {
    flex: 1,
    marginLeft: 12,
  },
  fullName: {
    fontSize: 18,
    color: '#35014B',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  username: {
    fontSize: 14,
    color: '#CA7FEB',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#692985',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 2,
    backgroundColor: '#DEA6F7',
    marginVertical: 12,
  },
  thinSeparator: {
    height: 1,
    backgroundColor: '#DEA6F7',
    opacity: 0.3,
    marginVertical: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  fieldLabel: {
    color: '#6B298A',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  fieldValue: {
    color: '#4B5563',
    fontSize: 15,
    flex: 1,
    textAlign: 'right',
  },
});