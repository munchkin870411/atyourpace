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
  '#99E699', '#20B2AA', '#909090', '#FAFAFA'
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

  const handleClose = () => {
    // Återställ färgen till originalet om användaren inte sparar
    onColorChange(selectedColor);
    setLocalColor(selectedColor);
    setLocalAvatar(selectedAvatar);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, styles.modalContainerTransparent]}>
          <LinearGradient
            colors={[colorTheme.lightest, colorTheme.light]}
            style={styles.gradientOverlay}
            pointerEvents="none"
          />
          <View style={[styles.header, { backgroundColor: colorTheme.darker }]}>
            <Text style={[styles.headerTitle, styles.headerTitleBlack]}>Edit your profile</Text>
            <TouchableOpacity style={[styles.avatarButton, styles.avatarButtonTransparent]} onPress={handleClose}>
              <Text style={[styles.avatarButtonText, styles.avatarButtonTextLarge]}>{localAvatar}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.scrollContent, styles.scrollContentPadding]}>
            <View style={[styles.section, styles.sectionSpacing]}>
              <Text style={[styles.sectionTitle, styles.sectionTitleCustom, { color: colorTheme.textColor }]}>Choose your avatar</Text>
              <View style={[styles.avatarGrid, styles.avatarGridGap]}>
                {avatars.map((avatar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.avatarCircle,
                      styles.avatarCircleSmall,
                      localAvatar === avatar && [styles.avatarCircleSelected, { borderColor: colorTheme.dark }],
                    ]}
                    onPress={() => setLocalAvatar(avatar)}
                  >
                    <Text style={[styles.avatarText, styles.avatarTextMedium]}>{avatar}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.section, styles.sectionSpacing]}>
              <Text style={[styles.sectionTitle, styles.sectionTitleCustom, { color: colorTheme.textColor }]}>Pick a color theme</Text>
              <View style={[styles.colorGrid, styles.colorGridGap]}>
                {colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorCircle,
                      styles.colorCircleLarge,
                      { backgroundColor: color },
                      localColor === color && [styles.colorCircleSelected, { borderColor: colorTheme.dark }],
                    ]}
                    onPress={() => {
                      setLocalColor(color);
                      onColorChange(color);
                    }}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.section, styles.sectionSpacingSmall]}>
              <Text style={[styles.sectionTitle, styles.sectionTitleCustom, { color: colorTheme.textColor }]}>Choose time format</Text>
              <View style={[styles.timeFormatContainer, styles.timeFormatContainerGap]}>
                <TouchableOpacity
                  style={[
                    styles.timeFormatButton,
                    styles.timeFormatButtonPadding,
                    { backgroundColor: colorTheme.lightest },
                    timeFormat === 'schedule' && { backgroundColor: colorTheme.darker },
                  ]}
                  onPress={() => setTimeFormat('schedule')}
                >
                  <Text style={[
                    styles.timeFormatText,
                    timeFormat === 'schedule' ? styles.timeFormatTextBlack : { color: colorTheme.textColor },
                    timeFormat === 'schedule' && styles.timeFormatTextSelected,
                  ]}>
                    Schedule
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeFormatButton,
                    styles.timeFormatButtonPadding,
                    { backgroundColor: colorTheme.lightest },
                    timeFormat === 'minutes' && { backgroundColor: colorTheme.darker },
                  ]}
                  onPress={() => setTimeFormat('minutes')}
                >
                  <Text style={[
                    styles.timeFormatText,
                    timeFormat === 'minutes' ? styles.timeFormatTextBlack : { color: colorTheme.textColor },
                    timeFormat === 'minutes' && styles.timeFormatTextSelected,
                  ]}>
                    Minutes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeFormatButton,
                    styles.timeFormatButtonPadding,
                    { backgroundColor: colorTheme.lightest },
                    timeFormat === 'notime' && { backgroundColor: colorTheme.darker },
                  ]}
                  onPress={() => setTimeFormat('notime')}
                >
                  <Text style={[
                    styles.timeFormatText,
                    timeFormat === 'notime' ? styles.timeFormatTextBlack : { color: colorTheme.textColor },
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
                styles.saveButtonWithShadow,
                { backgroundColor: colorTheme.darkest }
              ]} 
              onPress={handleSave}
            >
              <Text style={[styles.saveButtonText, { color: colorTheme.textColor }]}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
