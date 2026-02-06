import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileModalStyles as styles } from '../styles/profileModalStyles';
import { ColorTheme } from '../utils/colorUtils';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeFormatChange: (format: 'schedule' | 'minutes' | 'notime') => void;
  selectedAvatar: string;
  onAvatarChange: (avatar: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  colorTheme: ColorTheme;
}

const avatars = ['😀', '😎', '🎨', '🚀', '⭐', '🌈', '🎵', '🍕', '👤', '🌸', '🐱', '🎮'];
const colors = [
  '#FFB3E6', '#D4A5F0', '#A8C8FF', '#A8F0F0',
  '#99E699', '#B5B5B5', '#909090', '#FAFAFA'
];

export default function ProfileModal({ visible, onClose, onTimeFormatChange, selectedAvatar, onAvatarChange, selectedColor, onColorChange, colorTheme }: ProfileModalProps) {
  const [localAvatar, setLocalAvatar] = useState(selectedAvatar);
  const [localColor, setLocalColor] = useState(selectedColor);
  const [timeFormat, setTimeFormat] = useState<'schedule' | 'minutes' | 'notime'>('schedule');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setLocalAvatar(selectedAvatar);
  }, [selectedAvatar]);

  useEffect(() => {
    setLocalColor(selectedColor);
  }, [selectedColor]);

  const loadSettings = async () => {
    try {
      const savedFormat = await AsyncStorage.getItem('timeFormat');
      if (savedFormat) {
        setTimeFormat(savedFormat as 'schedule' | 'minutes' | 'notime');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('timeFormat', timeFormat);
      await AsyncStorage.setItem('selectedAvatar', localAvatar);
      await AsyncStorage.setItem('selectedColor', localColor);
      onTimeFormatChange(timeFormat);
      onAvatarChange(localAvatar);
      onColorChange(localColor);
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: 'transparent', overflow: 'hidden' }]}>
          <LinearGradient
            colors={[colorTheme.lightest, colorTheme.light]}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <View style={[styles.header, { backgroundColor: colorTheme.darker }]}>
            <Text style={[styles.headerTitle, { color: '#000000' }]}>Edit your profile</Text>
            <TouchableOpacity style={[styles.avatarButton, { backgroundColor: 'transparent' }]} onPress={onClose}>
              <Text style={[styles.avatarButtonText, { fontSize: 26 }]}>{localAvatar}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#000000' }]}>Choose your avatar</Text>
              <View style={styles.avatarGrid}>
                {avatars.map((avatar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.avatarCircle,
                      localAvatar === avatar && [styles.avatarCircleSelected, { borderColor: colorTheme.dark }],
                    ]}
                    onPress={() => setLocalAvatar(avatar)}
                  >
                    <Text style={styles.avatarText}>{avatar}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#000000' }]}>Pick a color theme</Text>
              <View style={styles.colorGrid}>
                {colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      localColor === color && [styles.colorCircleSelected, { borderColor: colorTheme.dark }],
                    ]}
                    onPress={() => setLocalColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#000000' }]}>Choose time format</Text>
              <View style={styles.timeFormatContainer}>
                <TouchableOpacity
                  style={[
                    styles.timeFormatButton,
                    { backgroundColor: colorTheme.lightest },
                    timeFormat === 'schedule' && { backgroundColor: colorTheme.darker },
                  ]}
                  onPress={() => setTimeFormat('schedule')}
                >
                  <Text style={[
                    styles.timeFormatText,
                    timeFormat === 'schedule' && styles.timeFormatTextSelected,
                  ]}>
                    Schedule
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeFormatButton,
                    { backgroundColor: colorTheme.lightest },
                    timeFormat === 'minutes' && { backgroundColor: colorTheme.darker },
                  ]}
                  onPress={() => setTimeFormat('minutes')}
                >
                  <Text style={[
                    styles.timeFormatText,
                    timeFormat === 'minutes' && styles.timeFormatTextSelected,
                  ]}>
                    Minutes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeFormatButton,
                    { backgroundColor: colorTheme.lightest },
                    timeFormat === 'notime' && { backgroundColor: colorTheme.darker },
                  ]}
                  onPress={() => setTimeFormat('notime')}
                >
                  <Text style={[
                    styles.timeFormatText,
                    timeFormat === 'notime' && styles.timeFormatTextSelected,
                  ]}>
                    No time
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: colorTheme.darkest,
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5
                }
              ]} 
              onPress={handleSave}
            >
              <Text style={[styles.saveButtonText, { color: '#000000' }]}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
