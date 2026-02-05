import React from 'react';
import { View, Text, Image, Platform, StatusBar, TouchableOpacity } from 'react-native';
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
    <View style={[styles.header, { paddingTop: statusBarHeight, backgroundColor: colorTheme.darker, borderBottomColor: colorTheme.darkest }]}>
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
