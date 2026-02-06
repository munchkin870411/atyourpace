import React from 'react';
import { View, Text, Image, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { headerStyles as styles } from '../styles/headerStyles';
import { ColorTheme } from '../utils/colorUtils';

interface HeaderProps {
  onProfilePress: () => void;
  avatar: string;
  colorTheme: ColorTheme;
}

export default function Header({ onProfilePress, avatar, colorTheme }: HeaderProps) {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
  
  return (
    <View style={[styles.header, { paddingTop: statusBarHeight, backgroundColor: 'transparent', borderBottomColor: colorTheme.darkest, overflow: 'hidden' }]}>
      <LinearGradient
        colors={[colorTheme.primary, colorTheme.darker]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        pointerEvents="none"
      />
      <View style={styles.headerLeft}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logoImage}
        />
      </View>
      <TouchableOpacity onPress={onProfilePress}>
        <Text style={styles.profileIcon}>{avatar}</Text>
      </TouchableOpacity>
    </View>
  );
}
